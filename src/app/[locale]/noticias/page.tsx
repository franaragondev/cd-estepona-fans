"use client";

import React, { useState, useEffect } from "react";
import NewsCard from "@/components/NewsCard";
import { dummyNews } from "@/data/dummyNews";

const BATCH_SIZE = 9;

export default function NewsPage() {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  useEffect(() => {
    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.innerHeight + window.scrollY;

      if (
        scrollHeight - scrollPosition < 100 &&
        visibleCount < dummyNews.length
      ) {
        setVisibleCount((prev) =>
          Math.min(prev + BATCH_SIZE, dummyNews.length)
        );
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <h1 className="text-3xl font-bold mb-8 text-center italic uppercase bg-gradient-to-r from-[#DC2C20] via-[#7B1FA2] to-[#2f36a1] bg-clip-text text-transparent">
          Noticias
        </h1>

        <div
          className="grid gap-8
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3"
        >
          {dummyNews
            .slice(0, visibleCount)
            .map(({ id, slug, title, date, image, content, author }, index) => (
              <NewsCard
                key={`${id}-${index}`}
                slug={slug}
                title={title}
                date={date}
                image={image}
                content={content}
                author={author}
              />
            ))}
        </div>
      </main>
    </>
  );
}
