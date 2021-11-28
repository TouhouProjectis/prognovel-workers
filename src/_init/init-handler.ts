import { fetchInit } from './fetch-init';
import { headers } from '../handler';
// import { responseError, novelNameNotFound } from '../utils/errors'

export async function handleInit(event: FetchEvent): Promise<Response> {
  const url = new URL(event.request.url);
  const params: InitParams = {
    novels: url.searchParams.get('novels') || '',
  };
  const novels = params.novels!.split(',');

  const result: InitResponse = await fetchInit(event, novels);

  const initHeaders = headers;
  initHeaders['Access-Control-Allow-Origin'] = result.cors;

  /** TODO
   *
   *  Somehow save CORS settings grabbed from github into
   *  this API and apply it into the rest of endpoints
   *
   */

  return new Response(JSON.stringify(result, null, 2), {
    headers: initHeaders,
  });
}
