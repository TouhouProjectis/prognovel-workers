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
  const params = {
    novel: url.searchParams.get('novel') || '',
    file: url.searchParams.get('file') || '',
  };

  const key = `image:${params.novel ? params.novel + ':' : ''}${params.file}`;
  let fileBuffer: any = await BUCKET.get(key, 'arrayBuffer');
  console.log('🍯 halo');
  const { imageResizerService, width, height, type } =
    event.request.method === 'POST' ? await event.request.clone().json() : ({} as any);

  if (!fileBuffer) {
    return new Response('File not found.', {
      status: 404,
    });
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    // 'Cache-Control': 'private, max-age=86400000',
    'Content-Type': 'image/png',
  };

  if (imageResizerService) {
    const imgUrl =
      imageResizerService +
      `/resize?width=${width}&height=${height}&type=${type || 'jpeg'}&nocrop=false&stripmeta=true`;
    console.log('🎨 resize image...', imgUrl);
    try {
      const imageRes = (await fetch(imgUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'image/*',
        },
        body: fileBuffer,
      })) as any;
      const { readable, writable } = new TransformStream();
      imageRes.body.pipeTo(writable);
      return new Response(readable, {
        status: 200,
        headers,
      });
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
