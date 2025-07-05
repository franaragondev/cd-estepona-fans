import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import NewsButton from "@/components/CommonButton";
import SubscribeModal from "@/components/SubscribeModal";
import MarkdownViewer from "@/components/MarkdownViewer";
import ShareButtons from "@/components/ShareButtons";
import InlineSubscribe from "@/components/InlineSubscribe";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug, locale } = params;

  const article = await prisma.news.findFirst({
    where: { slug },
    include: {
      translations: {
        select: {
          language: true,
          title: true,
          content: true,
        },
      },
    },
  });

  if (!article) {
    return {};
  }

  const translation = article.translations.find((t) => t.language === locale);

  const title = translation?.title ?? article.title;
  const description = translation?.content
    ? translation.content.substring(0, 150).replace(/\n/g, " ") + "..."
    : article.content
    ? article.content.substring(0, 150).replace(/\n/g, " ") + "..."
    : "CD Estepona Fans news article";

  const baseUrl = "https://www.cdesteponafans.com";
  const url = `${baseUrl}/${locale}/cantera/noticias/${slug}`;

  const image = article.image?.startsWith("http")
    ? article.image
    : article.image
    ? `${baseUrl}${article.image}`
    : `${baseUrl}/default-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const baseUrl = "https://www.cdesteponafans.com";
  const fullUrl = `${baseUrl}/${locale}/cantera/noticias/${slug}`;

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

        <ShareButtons url={fullUrl} title={displayTitle} label={t("share")} />

        <div className="w-full rounded-xl overflow-hidden flex justify-center">
          {article.image && (
            <Image
              src={
                article.image.startsWith("http")
                  ? article.image
                  : `${baseUrl}${article.image}`
              }
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
          href={`/${locale}/cantera/noticias`}
          className="inline-block px-4 py-2 rounded text-white bg-[#2f36a1] hover:bg-[#DC2C20] transition-colors duration-200 cursor-pointer"
          buttonTitle="button"
          translation="newsPage"
        />
      </main>
      <div className="bg-gray-50">
        <InlineSubscribe />
      </div>
    </>
  );
}
