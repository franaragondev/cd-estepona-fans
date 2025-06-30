// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { translateText } from "@/lib/deepl";

// curl -X POST http://localhost:3000/api/test-translations
// export async function POST() {
//   const newsItems = await prisma.news.findMany({
//     include: { translations: true },
//   });

//   const targetLanguages = ["en", "fr"];

//   for (const news of newsItems) {
//     for (const lang of targetLanguages) {
//       const alreadyTranslated = news.translations.find(
//         (t) => t.language === lang
//       );

//       if (!alreadyTranslated) {
//         try {
//           const translatedTitle = await translateText(
//             news.title,
//             lang.toUpperCase()
//           );
//           const translatedContent = await translateText(
//             news.content,
//             lang.toUpperCase()
//           );

//           await prisma.newsTranslation.create({
//             data: {
//               language: lang,
//               title: translatedTitle,
//               content: translatedContent,
//               newsId: news.id,
//             },
//           });

//           console.log(`Traducida noticia ${news.title} a ${lang}`);
//         } catch (error) {
//           console.error(
//             `Error traduciendo noticia ${news.title} a ${lang}:`,
//             error
//           );
//         }
//       }
//     }
//   }

//   return NextResponse.json({ message: "Traducciones completadas" });
// }
