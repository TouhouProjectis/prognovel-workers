import { responseError, chapterNameNotFound, chapterNovelNotFound } from '../utils/errors';
import { headers } from '../handler';
import { fetchChapter } from './fetch-chapter';
// import { streamChapters } from './stream-chapters';

const MAX_AGE = 60 * 60;

export async function handleChapter(event: FetchEvent): Promise<Response> {
  const url = new URL(event.request.url);
  const params: ChapterParams = {
    novel: url.searchParams.get('novel') || '',
    fetch:
      (url.searchParams.get('fetch') || '')
        .trim()
        .split(',')
        .filter((s) => !!s) || [],
    stream: !!(url.searchParams.get('stream') || false),
  };
  console.log(params);

  // required params checks
  if (!params.novel) return responseError(chapterNovelNotFound);

  if (params.stream) {
    // if (!params.chaptersStreamed) return responseError(chaptersStreamedNotFound);
    // return streamChapters(event, params);
    return new Response('');
  } else {
    if (!params.fetch) return responseError(chapterNameNotFound);
    try {
      let result = await fetchChapter(params);
      const init = { headers };
      init.headers['Cache-Control'] = `private, max-age=${MAX_AGE}`;

      return new Response(JSON.stringify(result), init);
    } catch (err) {
      const init = { headers };
      init.headers['Cache-Control'] = `private, max-age=5`;

      return new Response(JSON.stringify(err), init);
    }
  }
}
