import { getGithubContentURL } from '../utils/github';
import { DB } from '../_shared';

export async function fetchInit(event: FetchEvent, novels: string[]): Promise<InitResponse> {
  let meta;
  try {
    meta = await DB.getSiteMetadata();
  } catch (error) {
    console.error(error);
    // return {}
  }

  return {
    site_title: meta.site_title || '',
    contact: meta.contact || '',
    global_payment_pointers: meta.global_payment_pointers || {},
    limit_global_payment_pointers_share_in_novel:
      meta.limit_global_payment_pointers_share_in_novel || '10%',
    backend_api: meta.backend_api || '',
    novels: meta.novels || [],
    cors: meta.cors || '*',
    novelsMetadata: meta.novelsMetadata || [],
    disqus_id: meta.disqus_id || '',
  };
}
