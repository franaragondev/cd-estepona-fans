"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import NewsCard from "@/components/NewsCard";

type NewsTranslation = {
  language: string;
  title: string;
  content: string;
};

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
  image: string | null;
  content: string;
  author: {
    name: string;
  };
  translations: NewsTranslation[];
};

const BATCH_SIZE = 9;

export default function NewsPage() {
  const locale = useLocale();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetching = useRef(false);

  async function fetchNews(skip: number, take: number) {
    if (isFetching.current) return;

    setLoading(true);
    isFetching.current = true;

    try {
      const res = await fetch(`/api/news/cantera?skip=${skip}&take=${take}`);
      if (!res.ok) {
        setLoading(false);
        isFetching.current = false;
        return;
      }
      const data = await res.json();

      setNews((prev) => {
        const combined = skip === 0 ? data : [...prev, ...data];

        const uniqueNews = combined.filter(
          (item: NewsItem, index: number, self: NewsItem[]) =>
            index === self.findIndex((t: NewsItem) => t.id === item.id)
        );
        return uniqueNews;
      });

      setHasMore(data.length === take);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }

  useEffect(() => {
    setNews([]);
    setHasMore(true);
    fetchNews(0, BATCH_SIZE);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.innerHeight + window.scrollY;

      if (scrollHeight - scrollPosition < 100 && !loading && hasMore) {
        fetchNews(news.length, BATCH_SIZE);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [news, loading, hasMore]);

  const firstNews = news.length > 0 ? news[0] : null;

  const otherNews = news.length > 1 ? news.slice(1) : [];

  return (
    <>
      <style>
        {`
          .fade-in {
            opacity: 0;
            transform: translateY(10px);
            animation: fadeInUp 0.5s forwards;
          }

          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <main className="max-w-[100rem] mx-auto px-4 py-8 min-h-[85vh]">
        <h1 className="sr-only">Noticias CD Estepona Cantera</h1>

        {firstNews && (
          <>
            <div className="block md:hidden mb-12">
              <NewsCard
                href={`/${locale}/cantera/noticias/${firstNews.slug}`}
                title={
                  firstNews.translations.find((t) => t.language === locale)
                    ?.title ?? firstNews.title
                }
                date={firstNews.createdAt}
                image={firstNews.image ?? ""}
                content={
                  (
                    firstNews.translations.find((t) => t.language === locale)
                      ?.content ?? firstNews.content
                  ).slice(0, 150) + "…"
                }
                author={firstNews.author.name}
              />
            </div>

            <Link
              href={`/${locale}/cantera/noticias/${firstNews.slug}`}
              className="hidden md:flex mb-12 rounded-xl overflow-hidden h-[60vh] group"
            >
              <div className="relative w-4/5 h-full overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-300 transform group-hover:scale-[1.03]">
                  <Image
                    src={firstNews.image ?? ""}
                    alt={firstNews.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority={true}
                  />
                </div>
              </div>

              <div className="w-2/5 p-6 flex flex-col justify-center bg-[#f5f7fa]">
                <h2 className="text-3xl font-bold mb-4 text-[#333]">
                  {firstNews.translations.find((t) => t.language === locale)
                    ?.title ?? firstNews.title}
                </h2>
              </div>
            </Link>
          </>
        )}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {otherNews.map(
            ({
              id,
              slug,
              title,
              createdAt,
              image,
              content,
              author,
              translations,
            }) => {
              const translated = translations.find(
                (t) => t.language === locale
              );

              const displayTitle = translated?.title ?? title;
              const displayContent = translated?.content ?? content;

              return (
                <NewsCard
                  key={id}
                  href={`/${locale}/cantera/noticias/${slug}`}
                  title={displayTitle}
                  date={createdAt}
                  image={image ?? ""}
                  content={
                    displayContent.length > 150
                      ? displayContent.slice(0, 150) + "…"
                      : displayContent
                  }
                  author={author.name}
                />
              );
            }
          )}
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div
              className="w-12 h-12 rounded-full animate-spin"
              style={{
                background:
                  "conic-gradient(from 45deg, #DC2C20, #DC2C20, #2f36a1, #2f36a1, transparent 270deg 360deg)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 5px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 5px))",
              }}
            />
          </div>
        )}
      </main>
    </>
  );
}
