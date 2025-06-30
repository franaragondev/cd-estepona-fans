"use client";

import { useLocale, useTranslations } from "next-intl";
import NewsCard from "@/components/NewsCard";
import NewsButton from "../CommonButton";

interface NewsTranslation {
  language: string;
  title: string;
}

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
  image?: string | null;
  published: boolean;
  translations: NewsTranslation[];
}

interface LatestNewsProps {
  latestNews: NewsItem[];
}

export default function LatestNews({ latestNews }: LatestNewsProps) {
  const locale = useLocale();
  const t = useTranslations("latestNews");

  return (
    <section>
      <h2 className="text-center text-2xl md:text-[2.5rem] font-bold leading-[1.1] tracking-[-0.01em] uppercase text-[#19246b] mb-8 text-left mt-14 ml-4">
        {t("title")}
      </h2>
      <div
        className="grid gap-6 justify-center
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    max-w-7xl
                    mx-auto
                    px-4"
      >
        {latestNews.map(
          ({ id, slug, title, createdAt, image, translations }, index) => {
            const translated = translations?.find((t) => t.language === locale);
            const displayTitle = translated?.title ?? title;

            return (
              <NewsCard
                key={`${id}-${index}`}
                slug={slug}
                title={displayTitle}
                date={createdAt}
                image={image ?? ""}
                variant="overlay"
              />
            );
          }
        )}
      </div>
      <div className="text-center mt-8">
        <NewsButton
          href={`/${locale}/noticias`}
          className="inline-block px-4 py-2 rounded text-white bg-[#DC2C20] hover:bg-[#2f36a1] transition-colors duration-200 cursor-pointer"
          buttonTitle="button"
          translation="latestNews"
        />
      </div>
    </section>
  );
}
