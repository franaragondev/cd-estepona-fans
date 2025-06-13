"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface VideoSnippet {
  title: string;
  publishedAt: string;
  description: string;
}

interface VideoItem {
  id: string;
  snippet: VideoSnippet;
}

export default function TribunaPage() {
  const t = useTranslations("tribuna");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/youtube/videos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVideos(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="relative flex items-center justify-center py-16 min-h-[85vh]">
        <div className="absolute inset-0 flex items-center justify-center z-10 -mt-20">
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
      </main>
    );
  }

  if (videos.length === 0) {
    return (
      <main className="flex items-center justify-center py-16 min-h-[85vh]">
        <p>{t("error")}</p>
      </main>
    );
  }

  const [latest, ...recent] = videos;
  const lastThree = recent.slice(0, 3);

  return (
    <main className="px-4 py-10 max-w-6xl mx-auto space-y-14 min-h-[85vh]">
      {/* Último vídeo */}
      <section>
        <div className="aspect-w-16 aspect-h-9 w-full h-[16rem] md:h-[28rem]">
          <iframe
            className="w-full h-full rounded-xl shadow-xl"
            src={`https://www.youtube.com/embed/${latest.id}`}
            title={latest.snippet.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <h1 className="text-2xl font-bold mt-4">{latest.snippet.title}</h1>
        <p className="text-gray-500 text-sm">
          {new Date(latest.snippet.publishedAt).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        {latest.snippet.description && (
          <p className="mt-2 text-gray-700 max-w-3xl">
            {latest.snippet.description.substring(0, 250)}…
          </p>
        )}
      </section>

      {/* Últimos 3 vídeos */}
      {lastThree.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">{t("latestEpisodes")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lastThree.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.snippet.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium line-clamp-2">
                    {video.snippet.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(video.snippet.publishedAt).toLocaleDateString(
                      "es-ES",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
