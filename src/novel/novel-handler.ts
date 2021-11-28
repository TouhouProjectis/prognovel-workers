import { fetchNovel, fetchNovelChapterTitles } from './fetch-novel';
import { headers } from '../handler';
import { responseError, novelNameNotFound } from '../utils/errors';

export async function handleNovel(event: FetchEvent): Promise<Response> {
  const url = new URL(event.request.url);
  const params: NovelParams = {
    novel: url.searchParams.get('name') || '',
    titlesOnly: !!url.searchParams.get('titles_only') || false,
  };

  if (!params.novel) return responseError(novelNameNotFound);
  if (params.titlesOnly) return await fetchNovelChapterTitles(params, event);

  try {
    const result: NovelResponse = await fetchNovel(params, event);
    return new Response(JSON.stringify(result), {
      headers,
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      statusText: JSON.stringify(error),
    });
  }
}
