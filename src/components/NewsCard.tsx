"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";

type NewsCardProps = {
  href: string;
  title: string;
  date: string;
  image: string;
  content?: string;
  author?: string;
  variant?: "overlay" | "detailed"; // "overlay" in LatestNews, "detailed" in NewsPage
};

export default function NewsCard({
  href,
  title,
  date,
  image,
  variant = "detailed",
}: NewsCardProps) {
  const locale = useLocale();

  const formattedDate = new Date(date).toLocaleDateString(locale);

  const neutralDark = "#333";
  const neutralLight = "#f5f7fa";

  if (variant === "overlay") {
    return (
      <Link
        href={href}
        className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition transform hover:scale-105 duration-300 group h-48 flex items-end p-4 text-white"
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
    <Link href={href} className="overflow-hidden flex flex-col">
      <div className="relative w-full h-48 rounded-xl overflow-hidden fade-in">
        <div className="transition-transform duration-300 transform hover:scale-[1.03] w-full h-full">
          <Image
            src={image}
            alt={`News image: ${title}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        </div>
      </div>

      <div className="pt-3 flex flex-col flex-grow align-left">
        <h2
          className="text-md font-semibold mb-2"
          style={{ color: neutralDark }}
        >
          {title}
        </h2>
      </div>
    </Link>
  );
}
