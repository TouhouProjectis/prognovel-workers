// import { getCacheKey } from '../utils/cache';
// import { getGithubContentURL } from '../utils/github';

// export async function streamChapters(event: FetchEvent, params: ChapterParams): Promise<Response> {
//   let { readable, writable } = new TransformStream();
//   const { novel, book, format } = params;
//   const chapters = ['1', '2', '3', '4', '5'];
//   event.waitUntil(stream(chapters));

//   return new Response(readable, {
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//     },
//   });

//   async function stream(chapters: string[]) {
//     for (const chapter of chapters) {
//       const url = getGithubContentURL(
//         event,
//         `/novels/${novel}/contents/${book ? book + '/' : ''}${chapter}.${format}`,
//       );
//       let response: Response | undefined = await getCache().match(getCacheKey(event, url));

//       if (!response) {
//         response = await fetch(url);
//       }

//       await writable.getWriter().write(await response.text());
//     }
//   }
// }
