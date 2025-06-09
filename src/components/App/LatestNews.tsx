"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

const dummyNews = [
  {
    id: 1,
    title: "Victoria contundente en el último partido",
    date: "2025-06-01",
    image: "/dummy.jpg",
  },
  {
    id: 2,
    title: "Anuncio de nueva equipación para la temporada 2025",
    date: "2025-05-25",
    image: "/dummy.jpg",
  },
  {
    id: 3,
    title: "Partido solidario el próximo domingo",
    date: "2025-05-20",
    image: "/dummy.jpg",
  },
  {
    id: 4,
    title: "Entrenamiento abierto para los fans",
    date: "2025-06-10",
    image: "/dummy.jpg",
  },
  {
    id: 5,
    title: "Venta anticipada de entradas para el derbi",
    date: "2025-06-12",
    image: "/dummy.jpg",
  },
  {
    id: 6,
    title: "Nuevo entrenador confirmado para la próxima temporada",
    date: "2025-06-15",
    image: "/dummy.jpg",
  },
];

export default function LatestNews() {
  const locale = useLocale();

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Últimas Noticias
      </h2>
      <div
        className="grid gap-6 justify-center
                      grid-cols-1
                      sm:grid-cols-2
                      md:grid-cols-3
                      max-w-7xl
                      mx-auto
                      px-4"
      >
        {dummyNews.map(({ id, title, date, image }) => (
          <Link
            key={id}
            href={`/${locale}/news/${id}`}
            className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105 duration-300 group h-48 flex items-end p-4 text-white"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: "rgba(0,0,0,0.35)", zIndex: 10 }}
            />
            <div className="relative z-20">
              <time className="block text-sm mb-1">
                {new Date(date).toLocaleDateString(locale)}
              </time>
              <h3 className="text-lg font-bold leading-tight">{title}</h3>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          href={`/${locale}/news`}
          className="inline-block px-4 py-2 rounded text-white bg-[#DC2C20] hover:bg-[#2f36a1] transition-colors duration-200 cursor-pointer"
        >
          Ver todas las noticias
        </Link>
      </div>
    </section>
  );
}
