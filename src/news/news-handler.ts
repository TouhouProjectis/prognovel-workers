import { headers } from '../handler';
import { DB } from '../_shared';

export async function handleNews(event: FetchEvent): Promise<Response> {
  let news: any;
  try {
    news = (await DB.getSiteMetadata()).news;
  } catch (error) {
    console.error(error);
    // return {}
  }

  let result = news
    ? Object.keys(news)
        .map((id) => {
          return {
            id,
            ...news[id],
          };
        })
        .sort((a, b) => {
          return b.date - a.date;
        })
    : [];

  return new Response(JSON.stringify(result), { headers });
}
