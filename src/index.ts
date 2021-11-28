import { handleRequest } from './handler';

export const CORS = '*';
export const VERSION = '0.0.1';
export const IMAGE_RESIZE_ENDPOINT = 'https://image-resize.fly.dev/';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});
