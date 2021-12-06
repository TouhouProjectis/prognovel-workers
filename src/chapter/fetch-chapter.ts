import { DB } from '../_shared';

export async function fetchChapter(params: ChapterParams): Promise<ChapterResponse> {
  return await getRawChapter(params);

  async function getRawChapter({ novel, fetch }: ChapterParams): Promise<ChapterResponse> {
    if (typeof fetch === 'string') fetch = [fetch];
    const result = await DB.getChapter(novel, fetch);
    console.log(result);
    return result.reduce((prev: ChapterResponse, cur: RawContent): ChapterResponse => {
      const chapter: ChapterFetch = {
        title: cur.title,
        html: cur.content,
        contributors: cur.contributors || {},
        monetization: Boolean(cur.monetization === true || cur.monetization === 'true'),
        status: 200,
      };
      prev[cur.id] = chapter;
      return prev;
    }, {} as ChapterResponse);
  }
}
