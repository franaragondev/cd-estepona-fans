"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import Link from "next/link";

const dummyNews = [
  {
    id: 1,
    title: "Victoria contundente en el último partido",
    date: "2025-06-01",
    image: "/dummy.jpg",
    content:
      "El equipo mostró un desempeño excelente en el último encuentro, asegurando la victoria con un marcador contundente.",
  },
  {
    id: 2,
    title: "Anuncio de nueva equipación para la temporada 2025",
    date: "2025-05-25",
    image: "/dummy.jpg",
    author: "Juán Sánchez",
    content:
      "Se ha revelado la nueva equipación oficial para la próxima temporada, con un diseño moderno y colores vibrantes.",
  },
];

const BATCH_SIZE = 9; // cuántas noticias cargar por scroll

export default function NewsPage() {
  const locale = useLocale();

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  useEffect(() => {
    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.innerHeight + window.scrollY;

      if (scrollHeight - scrollPosition < 100) {
        setVisibleCount((prev) => {
          if (prev >= dummyNews.length) return prev;
          return prev + BATCH_SIZE;
        });
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
            .map(({ id, title, date, image, content, author }, index) => (
              <Link
                key={`${id}-${index}`}
                href={`/${locale}/news/${id}`}
                className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-[1.03] duration-300 flex flex-col fade-in"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={false}
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <time className="text-sm text-gray-500 mb-1">
                    {date ? new Date(date).toLocaleDateString(locale) : ""}
                  </time>
                  <span className="text-xs text-gray-400 mb-2">
                    Por {author ? author : "CD Estepona Fans"}
                  </span>
                  <h2 className="text-lg font-semibold text-[#DC2C20] mb-2">
                    {title}
                  </h2>
                  <p className="text-gray-700 flex-grow">{content}</p>
                  <span className="mt-4 inline-block text-sm text-[#2f36a1] hover:underline">
                    Leer más &rarr;
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </main>
    </>
  );
}
