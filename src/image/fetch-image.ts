import { getCache, getCacheKey } from '../utils/cache';
import { imageBase64Encode } from '../utils/image';

export async function fetchImage(event: FetchEvent, { url, width, height, type }: ImageParams) {
  const endpoint = `${''}crop?url=${url}&width=${width}&height=${height}&type=${type}`;
  const cacheKey = getCacheKey(event, endpoint);

  // let t0 = Date.now();
  let response: Response | undefined = await getCache().match(cacheKey);
  // let t1 = Date.now();

  if (!response) {
    response = await fetch(endpoint);
    event.waitUntil(getCache().put(cacheKey, response.clone()));
  }

  let { readable, writable } = new TransformStream();
  //@ts-ignore
  response.body.pipeTo(writable);

  return new Response(readable, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'private, max-age=86400000',
      'Content-Type': 'image/' + type,
      // 'X-Raw-Fetch-Timing': (t1 - t0).toFixed(2) + 'ms',
    },
  });
}
