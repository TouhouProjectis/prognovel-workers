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

  try {
    const { imageResizerService, width, height, type } = await event.request.json();
    if (imageResizerService) {
      const imageRes = await fetch(
        imageResizerService + `/resize?width=${width}&height=${height}&type=${type || 'jpeg'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'image/*',
          },
          body: fileBuffer,
        },
      );
      fileBuffer = imageRes.body;
    }
  } catch (error) {
    console.error(error);
  }
  const { readable, writable } = new TransformStream();
  fileBuffer.pipeTo(writable);
  if (fileBuffer) {
    return new Response(readable, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        // 'Cache-Control': 'private, max-age=86400000',
        'Content-Type': 'image/png',
      },
    });
  } else {
    return new Response('File not found.', {
      status: 404,
    });
  }
}
