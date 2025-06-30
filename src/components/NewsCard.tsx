"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import MarkdownViewer from "./MarkdownViewer";

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
  const t = useTranslations("newsCard");

  const formattedDate = new Date(date).toLocaleDateString(locale);
  const href = `/${locale}/noticias/${slug}`;

  const neutralDark = "#333";
  const neutralGray = "#666";
  const neutralLight = "#f5f7fa";

  if (variant === "overlay") {
    return (
      <Link
        href={href}
        className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition transform hover:scale-105 duration-300 group h-48 flex items-end p-4 text-white"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(0,0,0,0.35)", zIndex: 10 }}
        />
        <div className="relative z-20">
          <time
            className="block text-sm mb-1"
            style={{ color: neutralLight, fontWeight: 500 }}
          >
            {formattedDate}
          </time>
          <h3
            className="text-lg font-bold leading-tight"
            style={{ color: neutralLight }}
          >
            {title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition transform hover:scale-[1.03] duration-300 flex flex-col fade-in"
      style={{
        backgroundColor: neutralLight,
      }}
    >
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={`News image: ${title}`}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <time
          className="text-sm text-gray-500 mb-1"
          style={{ color: neutralGray, fontWeight: 500 }}
        >
          {formattedDate}
        </time>
        <span
          className="text-xs mb-2"
          style={{ color: neutralGray, fontStyle: "italic" }}
        >
          {t("byAuthor", {
            author: author || "CD Estepona Fans",
          })}
        </span>
        <h2
          className="text-lg font-semibold mb-2 uppercase"
          style={{ color: neutralDark }}
        >
          {title}
        </h2>
        {content && (
          <div
            className="text-gray-700 flex-grow"
            style={{ color: neutralDark, opacity: 0.85 }}
          >
            <MarkdownViewer content={content} />
          </div>
        )}
      </div>
    </Link>
  );
}
