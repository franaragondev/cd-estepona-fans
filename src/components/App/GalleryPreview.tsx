"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

const images = [
  "/dummy.jpg",
  "/dummy.jpg",
  "/dummy.jpg",
  "/dummy.jpg",
  "/dummy.jpg",
  "/dummy.jpg",
];

export default function GalleryPreview() {
  const locale = useLocale();

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Galería de Fans</h2>
      <div className="grid grid-cols-3 gap-3">
        {images.slice(0, 6).map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Fan pic ${i + 1}`}
            className="w-full h-32 object-cover rounded"
          />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          href={`/${locale}/gallery`}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Ver más en la galería
        </Link>
      </div>
    </section>
  );
}
