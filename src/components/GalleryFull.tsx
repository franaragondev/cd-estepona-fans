"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const modalImage = modalIndex !== null ? images[modalIndex]?.url : null;

  const showPrev = modalIndex !== null && modalIndex > 0;
  const showNext = modalIndex !== null && modalIndex < images.length - 1;

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

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
      { rootMargin: "100px" }
    );

    if (sentinel) observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [currentIndex, images, isLoadingMore]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (modalIndex === null) return;
      if (e.key === "ArrowRight" && showNext) setModalIndex((i) => i! + 1);
      if (e.key === "ArrowLeft" && showPrev) setModalIndex((i) => i! - 1);
      if (e.key === "Escape") setModalIndex(null);
    },
    [modalIndex, showNext, showPrev]
  );

  useEffect(() => {
    if (modalIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalIndex, handleKeyDown]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;

      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0 && showNext) {
          // swipe izquierda → siguiente imagen
          setModalIndex((i) => i! + 1);
          setIsImageLoading(true);
        } else if (deltaX < 0 && showPrev) {
          // swipe derecha → imagen anterior
          setModalIndex((i) => i! - 1);
          setIsImageLoading(true);
        }
      }
    }

    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {visibleImages.map(({ url, caption }, i) => (
          <div
            key={i}
            className="relative w-full h-40 cursor-pointer rounded overflow-hidden transition-transform duration-300 hover:scale-105"
            onClick={() => {
              setModalIndex(i);
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
          <div className="absolute inset-0 flex items-center justify-center z-10 mt-14">
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
          onClick={() => setModalIndex(null)}
        >
          <button
            onClick={() => setModalIndex(null)}
            className="fixed top-5 right-5 text-white text-3xl font-bold z-60 cursor-pointer"
          >
            &times;
          </button>

          {showPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalIndex((i) => i! - 1);
                setIsImageLoading(true);
              }}
              className="absolute left-5 text-white text-5xl font-bold z-60 cursor-pointer"
            >
              ‹
            </button>
          )}

          {showNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalIndex((i) => i! + 1);
                setIsImageLoading(true);
              }}
              className="absolute right-5 text-white text-5xl font-bold z-60 cursor-pointer"
            >
              ›
            </button>
          )}

          <div
            className="relative max-w-[90vw] max-h-[90vh] rounded shadow-lg flex items-center justify-center touch-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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
