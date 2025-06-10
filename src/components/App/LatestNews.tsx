"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  createdAt: string; // ISO string
  image?: string | null;
}
interface LatestNewsProps {
  latestNews: NewsItem[];
}

export default function LatestNews({ latestNews }: LatestNewsProps) {
  const locale = useLocale();

  console.log(latestNews);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Últimas Noticias
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
        {latestNews.map(({ id, slug, title, createdAt, image }, index) => (
          <NewsCard
            key={`${id}-${index}`}
            slug={slug}
            title={title}
            date={createdAt}
            image={image ?? ""}
            variant="overlay"
          />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          href={`/${locale}/noticias`}
          className="inline-block px-4 py-2 rounded text-white bg-[#DC2C20] hover:bg-[#2f36a1] transition-colors duration-200 cursor-pointer"
        >
          Ver todas las noticias
        </Link>
      </div>
    </section>
  );
}
