"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface VideoSnippet {
  title: string;
  publishedAt: string;
  description: string;
}

interface VideoItem {
  id: string;
  snippet: VideoSnippet;
}

export default function DirectosPage() {
  const t = useTranslations("live");
  const [liveVideo, setLiveVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/youtube/live")
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error desconocido");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveVideo(data[0]);
        } else {
          setLiveVideo(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching live video:", err);
        setError(err.message);
        setLiveVideo(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="flex items-center justify-center py-16 min-h-[85vh]">
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
      </main>
    );
  }

  if (!liveVideo || error) {
    return (
      <main className="flex flex-col items-center justify-center py-20 min-h-[85vh] bg-white px-6 text-center text-gray-700">
        {/* Icono simple, gris claro */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mb-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-semibold mb-2">
          {t("noLiveScheduledTitle")}
        </h2>
        <p className="max-w-md mb-6 leading-relaxed">
          {t("noLiveScheduledDescription")}
        </p>
        <Link
          href="/tribuna"
          rel="noopener noreferrer"
          className="inline-block border border-gray-400 px-6 py-2 rounded-md text-gray-600 font-medium hover:bg-gray-100 transition"
        >
          {t("visitChannel")}
        </Link>
      </main>
    );
  }

  return (
    <main className="px-4 py-10 max-w-4xl mx-auto min-h-[85vh]">
      <section>
        <div className="aspect-w-16 aspect-h-9 w-full h-[28rem]">
          <iframe
            className="w-full h-full rounded-xl shadow-xl"
            src={`https://www.youtube.com/embed/${liveVideo.id}?autoplay=1`}
            title={liveVideo.snippet.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <h1 className="text-2xl font-bold mt-4">{liveVideo.snippet.title}</h1>
        <p className="text-gray-500 text-sm">
          {new Date(liveVideo.snippet.publishedAt).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        {liveVideo.snippet.description && (
          <p className="mt-2 text-gray-700 max-w-3xl">
            {liveVideo.snippet.description.substring(0, 250)}…
          </p>
        )}
      </section>
    </main>
  );
}
