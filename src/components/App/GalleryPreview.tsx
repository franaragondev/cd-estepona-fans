"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

// Array of image paths stored in the public/gallery folder
const images = [
  "/gallery/IMG_9657.JPG",
  "/gallery/IMG_9658.JPG",
  "/gallery/IMG_9659.JPG",
  "/gallery/IMG_9660.JPG",
  "/gallery/IMG_9661.JPG",
  "/gallery/IMG_9662.JPG",
];

export default function GalleryPreview() {
  const locale = useLocale();
  // State to keep track of the currently selected image for the modal
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <section>
      {/* Section title */}
      <h2 className="text-2xl font-semibold mb-4">Galería de Fans</h2>

      {/* Image grid */}
      <div className="grid grid-cols-3 gap-3">
        {images.slice(0, 6).map((src, i) => (
          <div
            key={i}
            className="relative w-full h-40 cursor-pointer rounded overflow-hidden transition-transform duration-300 hover:scale-105"
            onClick={() => setModalImage(src)}
          >
            <Image
              src={src}
              alt={`Fan pic ${i + 1}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={i === 0} // optionally prioritize first image
            />
          </div>
        ))}
      </div>

      {/* Link to full gallery page */}
      <div className="text-center mt-8">
        <Link
          href={`/${locale}/gallery`}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Ver más en la galería
        </Link>
      </div>

      {/* Modal window */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          // Close modal when clicking outside the image
          onClick={() => setModalImage(null)}
        >
          {/* Close button outside the image container */}
          <button
            onClick={() => setModalImage(null)}
            className="fixed top-5 right-5 text-white text-3xl font-bold cursor-pointer z-60"
            aria-label="Close modal"
          >
            &times;
          </button>

          {/* Image container */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent modal close on image click
          >
            <Image
              src={modalImage}
              alt="Expanded image"
              width={1200}
              height={900}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}
