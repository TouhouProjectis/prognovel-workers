import { handleRequest } from './handler';

export const CORS = '*';
export const VERSION = '0.0.1';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});
