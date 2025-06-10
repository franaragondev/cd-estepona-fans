// app/[locale]/news/[id]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";

// Simulación de los datos (en vez de fetch de backend)
const dummyNews = [
  {
    id: 1,
    title: "Victoria contundente en el último partido",
    date: "2025-06-01",
    image: "/dummy.jpg",
    content:
      "El equipo mostró un desempeño excelente en el último encuentro, asegurando la victoria con un marcador contundente.",
    author: "CD Estepona Fans",
  },
  {
    id: 2,
    title: "Anuncio de nueva equipación para la temporada 2025",
    date: "2025-05-25",
    image: "/dummy.jpg",
    content:
      "Se ha revelado la nueva equipación oficial para la próxima temporada, con un diseño moderno y colores vibrantes.",
    author: "Juán Sánchez",
  },
];

// Si quieres definir <title> dinámico para SEO
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const article = dummyNews.find((n) => n.id.toString() === params.id);
  return {
    title: article ? article.title : "Noticia no encontrada",
  };
}

export default function NewsDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const article = dummyNews.find((n) => n.id.toString() === params.id);

  if (!article) {
    notFound(); // muestra página 404 si no existe
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 min-h-[85vh]">
      <h1 className="text-4xl font-bold mb-6 text-[#DC2C20]">
        {article.title}
      </h1>

      <div className="relative w-full h-64 mb-6 rounded overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="text-sm text-gray-500 mb-2">
        {new Date(article.date).toLocaleDateString(params.locale)}
      </div>
      <div className="text-sm text-gray-500 mb-6">
        Por {article.author || "CD Estepona Fans"}
      </div>

      <p className="text-lg text-gray-800 leading-relaxed">{article.content}</p>
    </main>
  );
}
