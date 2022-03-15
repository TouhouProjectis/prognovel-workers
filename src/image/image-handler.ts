declare const BUCKET: KVNamespace;
import { fetchImage } from './fetch-image';

const DEFAULT_IMG_WIDTH = 700;

export async function handleImage(event: FetchEvent): Promise<Response> {
  const url = new URL(event.request.url);
  const acceptHeader = event.request.headers.get('Accept')!;
  // Note: current implementation of image format to be served is WEBP first then
  // JPEG as fallback for browsers that don't support it (Safari, IE, etc). It's all done automatically
  // in Cloudflare Workers.
  // With little tweak it can fallback to PNG if it's the original image format served by Mangadex
  // However, since Image CDN industry standard goes with WEBP - JPEG format in favor of
  // lower image bytes, I'll go with JPEG as fallback for now.
  // const canServeWEBP = acceptHeader ? acceptHeader.includes('image/webp') : false
  const params: ImageParams = {
    url: url.searchParams.get('url') || '',
    width: +(url.searchParams.get('width') || 0),
    height: +(url.searchParams.get('height') || 0),
    type: acceptHeader.includes('image/webp') ? 'webp' : 'jpeg',
  };

  return fetchImage(event, params);
}

export async function handleFetchImage(event: FetchEvent): Promise<Response> {
  const url = new URL(event.request.url);
  const { novel, file, width, height, type, imageresizeservice } = {
    novel: url.searchParams.get('novel') || '',
    file: url.searchParams.get('file') || '',
    width: url.searchParams.get('width') || 512,
    height: url.searchParams.get('height') || 512,
    type: url.searchParams.get('type') || 'jpeg',
    imageresizeservice: url.searchParams.get('imageresizeservice') || '',
  };
  const cacheKey = new Request(event.request.url, {
    headers: event.request.headers,
    method: 'GET',
  });
  const cache = caches.default;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=86400000',
    'Content-Type': 'image/' + type,
  };
  // Check whether the value is already available in the cache
  // if not, you will need to fetch it from origin, and store it in the cache
  // for future access
  let response = await cache.match(cacheKey);
  console.log(response);
  if (response) {
    console.log('🚘 hitting CF cache!');
    return new Response(response.body, { headers: { ...headers, 'Workers-Cache-Hit': 'YES' } });
  }

  const key = `image:${novel ? novel + ':' : ''}${file}`;
  let fileBuffer: any = await BUCKET.get(key, 'arrayBuffer');

  if (!fileBuffer) {
    return new Response('File not found.', {
      status: 404,
    });
  }

  if (imageresizeservice) {
    const imgUrl =
      new URL(imageresizeservice).href +
      `resize?width=${width}&height=${height}&type=${type || 'jpeg'}&nocrop=false&stripmeta=true`;
    console.log('🎨 resize image...', imgUrl);
    try {
      const imageRes = (await fetch(imgUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'image/*',
        },
        body: fileBuffer,
      })) as any;
      event.waitUntil(cache.put(cacheKey, imageRes.clone()));
      const { readable, writable } = new TransformStream();
      imageRes.body.pipeTo(writable);
      response = new Response(readable, {
        status: 200,
        headers,
      });
      return response;
    } catch (error) {
      return new Response(JSON.stringify(error), {
        status: 500,
      });
    }
  } else {
    console.log('🎨 serve original image...');
    return new Response(fileBuffer, {
      status: 200,
      headers,
    });
  }
}

async function putIntoCache(cache: Cache, key: Request, response: Response) {
  try {
    // const reader = (response.body as any).getReader();
    // while (true) {
    //   if (((await (reader as any).read()) as any).done) break;
    // }
    // console.log((await (reader as any).read()) as any);
    await cache.put(key, response);
    console.log('💾 put into cache');
  } catch (error) {
    console.log('💾 ERROR putting into cache');
    console.error(error);
  }
}
