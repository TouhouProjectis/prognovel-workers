import { handleChapter } from './chapter/chapter-handler';
import { handleNovel } from './novel/novel-handler';
import { handleInit } from './_init/init-handler';
import { getMaxAge } from './utils/cache';
import { handleImage, handleFetchImage } from './image/image-handler';
import { handleVerifyReceipt } from './verify-wm-receipt/verify-receipt-handler';
import { handleFetchData } from './data/fetch-handler';

export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'Cache-Control': `public, max-age=${getMaxAge()}`,
};

export async function handleRequest(event: FetchEvent): Promise<Response> {
  const request: Request = event.request;
  const url = new URL(request.url);
  const path = url.pathname;

  // if (request.method !== 'GET') {
  //   return new Response('Can only handle GET request.', { status: 403 });
  // }

  switch (path) {
    case '/' || '/home' || '/init':
      return handleInit(event);
    case '/chapter':
      return handleChapter(event);
    case '/novel':
      return handleNovel(event);
    case '/image':
      return handleImage(event);
    case '/fetchImage':
      return handleFetchImage(event);
    case '/fetchData':
      return handleFetchData(event);
    case '/verify':
      return handleVerifyReceipt(event);
    default:
      break;
  }

  return new Response(`Invalid route 404. Path ${path} not found.`, { status: 404 });
}
