"use client";

import React, { useState, useEffect } from "react";
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

  async function fetchNews(skip: number, take: number) {
    setLoading(true);
    const res = await fetch(`/api/news?skip=${skip}&take=${take}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();

    setNews((prev) => (skip === 0 ? data : [...prev, ...data]));
    setHasMore(data.length === take);
    setLoading(false);
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

      <main className="max-w-7xl mx-auto px-4 py-8 min-h-[85vh]">
        <h1 className="sr-only">Noticias</h1>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {news.map(
            (
              {
                id,
                slug,
                title,
                createdAt,
                image,
                content,
                author,
                translations,
              },
              index
            ) => {
              const translated = translations.find(
                (t) => t.language === locale
              );

              const displayTitle = translated?.title ?? title;
              const displayContent = translated?.content ?? content;

              return (
                <NewsCard
                  key={`${id}-${index}`}
                  slug={slug}
                  title={displayTitle}
                  date={createdAt}
                  image={image ? image : ""}
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
