import { fetchReceipt } from './fetch-receipt';

export async function handleVerifyReceipt(event: FetchEvent): Promise<Response> {
  return fetchReceipt(event);
}
