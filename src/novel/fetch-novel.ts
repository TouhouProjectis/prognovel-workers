import { cleanHTML } from '../utils/string';

import { headers } from '../handler';
import { DB } from '../_shared';

export async function fetchNovelChapterTitles(
  params: NovelParams,
  event: FetchEvent,
): Promise<any> {
  try {
    const meta = await DB.getNovelMetadata(params.novel);
    return new Response(JSON.stringify(meta), { headers });
  } catch (error) {
    console.error('Error parsing json for novel');
    console.error(error);
    return new Response(JSON.stringify(error), {
      headers,
      status: 500,
      statusText: JSON.stringify(error),
    });
  }
}

export async function fetchNovel(params: NovelParams, event: FetchEvent): Promise<NovelResponse> {
  try {
    const { metadata, chapterTitles } = await DB.getNovelMetadata(params.novel);
    console.log({ metadata, chapterTitles });
    return {
      title: metadata.title || '',
      author: metadata.author || '',
      demographic: metadata.demographic || '',
      genre: metadata.genre || [],
      tags: metadata.tags || [],
      contact: metadata.contact || '',
      cover: metadata.cover,
      synopsis: cleanHTML(metadata.synopsis) || '',
      totalChapter: metadata.chapters ? metadata.chapters.length : 0,
      rev_share: metadata.rev_share || [],
      chapters: metadata.chapters || [],
      chapterTitles: chapterTitles,
      discord_group_id: (metadata.discord_group_id || '') + '',
    };
  } catch (error) {
    throw error;
    // return {}
  }
}
