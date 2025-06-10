"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import { dummyNews } from "@/data/dummyNews";

export default function LatestNews() {
  const locale = useLocale();

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
        {[...dummyNews]
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 6)
          .map(({ id, slug, title, date, image }, index) => (
            <NewsCard
              key={`${id}-${index}`}
              slug={slug}
              title={title}
              date={date}
              image={image}
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
