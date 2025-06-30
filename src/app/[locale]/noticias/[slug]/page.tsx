import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import NewsButton from "@/components/CommonButton";
import SubscribeModal from "@/components/SubscribeModal";
import MarkdownViewer from "@/components/MarkdownViewer";
import { getTranslations } from "next-intl/server";

export default async function Page({ params }: any) {
  const { slug, locale } = params;

  if (!slug) return notFound();

  const t = await getTranslations({ locale, namespace: "newsPage" });

  const article = await prisma.news.findFirst({
    where: { slug },
    include: {
      author: true,
      translations: {
        select: {
          language: true,
          title: true,
          content: true,
        },
      },
    },
  });

  if (!article) return notFound();

  const translation = article.translations.find((t) => t.language === locale);

  const displayTitle = translation?.title ?? article.title;
  const displayContent = translation?.content ?? article.content;

  const neutralDark = "#333";
  const neutralGray = "#666";

  return (
    <>
      <SubscribeModal />

      <main className="max-w-3xl mx-auto px-4 py-12 min-h-[85vh]">
        <h1
          className={`uppercase mb-6 text-3xl font-bold ${
            !article.showTitle ? "sr-only" : ""
          }`}
          style={{ color: neutralDark }}
        >
          {displayTitle}
        </h1>

        <div className="w-full rounded overflow-hidden flex justify-center">
          {article.image && (
            <Image
              src={article.image}
              alt={`Imagen de la noticia: ${displayTitle}`}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              priority
            />
          )}
        </div>

        <div
          className="text-sm mb-2 mt-2"
          style={{ color: neutralGray, fontWeight: 500 }}
        >
          {new Date(article.createdAt).toLocaleDateString(locale)}
        </div>

        <div
          className="text-sm mb-6"
          style={{ color: neutralGray, fontStyle: "italic" }}
        >
          {t("byAuthor", {
            author: article.author?.name || "CD Estepona Fans",
          })}
        </div>

        <div
          className="text-lg leading-relaxed mb-12"
          style={{ color: neutralDark, opacity: 0.85, whiteSpace: "pre-line" }}
        >
          <MarkdownViewer content={displayContent} />
        </div>

        <NewsButton
          href={`/${locale}/noticias`}
          className="inline-block px-4 py-2 rounded text-white bg-[#2f36a1] hover:bg-[#DC2C20] transition-colors duration-200 cursor-pointer"
          buttonTitle="button"
          translation="newsPage"
        />
      </main>
    </>
  );
}
