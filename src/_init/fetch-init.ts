import { DB } from '../_shared';

export async function fetchInit(event: FetchEvent, novels: string[]): Promise<InitResponse> {
  let meta: any;
  try {
    meta = await DB.getSiteMetadata();
  } catch (error) {
    console.error(error);
    // return {}
  }

  let news = meta.news
    ? Object.keys(meta.news)
        .map((news) => {
          delete meta.news[news].content;
          return {
            id: news,
            ...meta.news[news],
          };
        })
        .sort((a, b) => {
          return b.date - a.date;
        })
        .slice(0, 3)
    : [];

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
    image_resizer_service: meta.image_resizer_service || '',
    news,
  };
}
