declare const BUCKET: KVNamespace;
import fm from 'front-matter';

export const DB = {
  metadata: {} as any,
  content: {} as any,
  checkData: async function (novel: string | undefined = undefined) {
    if (typeof novel !== 'undefined') {
      this.content = await this.fetchNovelContent(novel);
    } else {
      this.metadata = await this.fetchMetadata();
    }
    return;
  },
  fetchMetadata: async function (): Promise<any> {
    const result = await BUCKET.get(`metadata`, 'json');
    if (typeof result === 'undefined')
      throw 'Metadata not found in global cache. Make sure to setup KV Workers correctly.';
    return result;
  },
  fetchNovelContent: async function (novel: string): Promise<any> {
    const result = await BUCKET.get(`data:${novel}:0`, 'json');
    if (typeof result === 'undefined')
      throw `Content for ${novel} not found in global cache. Make sure to setup KV Workers correctly.`;
    return result;
  },
  getChapter: async function (
    novel: string,
    volumeAndChapters: string[] | string,
  ): Promise<RawContent[]> {
    await this.checkData(novel);
    if (typeof volumeAndChapters === 'string') volumeAndChapters = [volumeAndChapters];

    return await Promise.all(
      volumeAndChapters.map((index: string): Promise<RawContent> => {
        return new Promise(async (resolve, reject) => {
          try {
            const result = this.content.content[index];
            const res = { id: index, content: result.body };
            delete result.body;
            resolve({
              ...res,
              ...result,
            });
          } catch (error) {
            reject(error);
          }
        });
      }),
    );
  },
  getSiteMetadata: async function () {
    await this.checkData();
    const result = this.metadata;
    console.log({ result });
    delete result.fullMetadata;
    return result;
  },
  getNovelMetadata: async function (novel: string) {
    await this.checkData(novel);
    const result = this.content;
    console.log({ result });
    if (!result) throw `Novel ${novel} not found.`;
    return { metadata: result.metadata, chapterTitles: result.chapterTitles };
  },
};
