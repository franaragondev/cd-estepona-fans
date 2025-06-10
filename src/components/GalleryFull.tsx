"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface GalleryFullProps {
  images: { url: string; caption?: string }[];
}

const CHUNK_SIZE = 12;

export default function GalleryFull({ images }: GalleryFullProps) {
  const [visibleImages, setVisibleImages] = useState(() =>
    images.slice(0, CHUNK_SIZE)
  );
  const [currentIndex, setCurrentIndex] = useState(CHUNK_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingMore &&
          currentIndex < images.length
        ) {
          setIsLoadingMore(true);
          setTimeout(() => {
            const nextImages = images.slice(
              currentIndex,
              currentIndex + CHUNK_SIZE
            );
            if (nextImages.length > 0) {
              setVisibleImages((prev) => [...prev, ...nextImages]);
              setCurrentIndex((prev) => prev + CHUNK_SIZE);
            }
            setIsLoadingMore(false);
          }, 500);
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [currentIndex, images, isLoadingMore]);

  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {visibleImages.map(({ url, caption }, i) => (
          <div
            key={i}
            className="relative w-full h-40 cursor-pointer rounded overflow-hidden transition-transform duration-300 hover:scale-105"
            onClick={() => {
              setModalImage(url);
              setIsImageLoading(true);
            }}
          >
            <Image
              src={url}
              alt={caption ?? `Fan pic ${i + 1}`}
              width={400}
              height={300}
              className="object-cover w-full h-full"
              loading={i < 4 ? "eager" : "lazy"}
              priority={i < 4}
            />
          </div>
        ))}
      </div>

      <div ref={sentinelRef} className="h-10 relative">
        {isLoadingMore && (
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
      </div>

      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <button
            onClick={() => setModalImage(null)}
            className="fixed top-5 right-5 text-white text-3xl font-bold z-60"
          >
            &times;
          </button>

          <div
            className="relative max-w-[90vw] max-h-[90vh] rounded shadow-lg flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isImageLoading && (
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
            <Image
              src={modalImage}
              alt="Expanded"
              width={1200}
              height={900}
              style={{ objectFit: "contain" }}
              priority
              onLoadingComplete={() => setIsImageLoading(false)}
              className={
                isImageLoading
                  ? "opacity-0"
                  : "opacity-100 transition-opacity duration-500"
              }
            />
          </div>
        </div>
      )}
    </section>
  );
}
