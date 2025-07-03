"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import NewsButton from "../CommonButton";

interface GalleryPreviewProps {
  images: string[];
}

export default function GalleryPreview({ images }: GalleryPreviewProps) {
  const locale = useLocale();
  const t = useTranslations("galleryPreview");
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <section>
      <h2 className="text-center text-2xl md:text-[2.5rem] font-bold leading-[1.1] tracking-[-0.01em] uppercase text-[#19246b] mb-8 text-left">
        {t("title")}
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {images.slice(0, 6).map((src, i) => (
          <div
            key={i}
            className="relative w-full h-40 cursor-pointer rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.03]"
            onClick={() => {
              setModalImage(src);
              setIsImageLoading(true);
            }}
          >
            <Image
              src={src}
              alt={`Fan pic ${i + 1}`}
              width={400}
              height={200}
              className="object-cover w-full h-full"
              loading={i === 0 ? "eager" : "lazy"}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <NewsButton
          href={`/${locale}/galeria`}
          className="inline-block px-4 py-2 bg-red-600 text-white rounded bg-[#DC2C20] hover:bg-[#2f36a1] transition-colors duration-200 cursor-pointer"
          buttonTitle="button"
          translation="galleryPreview"
        />
      </div>

      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <button
            onClick={() => setModalImage(null)}
            className="fixed top-5 right-5 text-white text-3xl font-bold cursor-pointer z-60"
            aria-label="Close modal"
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
              alt="Expanded image"
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
