import { headers } from '../handler';

const RECEIPT_VERIFIER_SERVER: string = 'https://webmonetization.org/api/receipts/verify';

export async function fetchReceipt(event: FetchEvent) {
  console.log(event.request.body);

  const res = await fetch(RECEIPT_VERIFIER_SERVER, {
    method: 'POST',
    body: event.request.body,
  });
  return new Response(await res.text(), {
    headers,
  });
}
