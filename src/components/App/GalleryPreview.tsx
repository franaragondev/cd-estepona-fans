"use client";

const images = [
  "/gallery1.jpg",
  "/gallery2.jpg",
  "/gallery3.jpg",
  "/gallery4.jpg",
  "/gallery5.jpg",
  "/gallery6.jpg",
];

export default function GalleryPreview() {
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
      <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Ver más en la galería
      </button>
    </section>
  );
}
