"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import React from "react";

type NewsCardProps = {
  slug: string;
  title: string;
  date: string;
  image: string;
  content?: string;
  author?: string;
  variant?: "overlay" | "detailed"; // "overlay" in LatestNews, "detailed" in NewsPage
};

export default function NewsCard({
  slug,
  title,
  date,
  image,
  content,
  author,
  variant = "detailed",
}: NewsCardProps) {
  const locale = useLocale();
  const formattedDate = new Date(date).toLocaleDateString(locale);

  const href = `/${locale}/noticias/${slug}`;

  if (variant === "overlay") {
    return (
      <Link
        href={href}
        className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105 duration-300 group h-48 flex items-end p-4 text-white"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10 }}
        />
        <div className="relative z-20">
          <time className="block text-sm mb-1">{formattedDate}</time>
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-[1.03] duration-300 flex flex-col fade-in"
    >
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={`Imagen de la noticia: ${title}`}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <time className="text-sm text-gray-500 mb-1">{formattedDate}</time>
        {author ? (
          <span className="text-xs text-gray-400 mb-2">Por {author}</span>
        ) : (
          <span className="text-xs text-gray-400 mb-2">CD Estepona Fans</span>
        )}
        <h2 className="text-lg font-semibold text-[#DC2C20] mb-2">{title}</h2>
        {content && <p className="text-gray-700 flex-grow">{content}</p>}
        <span className="mt-4 inline-block text-sm text-[#2f36a1]">
          Leer más →
        </span>
      </div>
    </Link>
  );
}
