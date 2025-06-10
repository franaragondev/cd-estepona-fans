import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { dummyNews } from "@/data/dummyNews";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const article = dummyNews.find((n) => n.slug === params.slug);
  console.log(article);

  return {
    title: article ? article.title : "Noticia no encontrada",
  };
}

export default function NewsDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const article = dummyNews.find((n) => n.slug === params.slug);
  console.log(article);

  if (!article) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 min-h-[85vh]">
      <h1 className="text-4xl font-bold mb-6 text-[#DC2C20]">
        {article.title}
      </h1>

      <div className="relative w-full h-64 mb-6 rounded overflow-hidden">
        <Image
          src={article.image}
          alt={`Imagen de la noticia: ${article.title}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="text-sm text-gray-500 mb-2">
        {new Date(article.date).toLocaleDateString(params.locale)}
      </div>
      <div className="text-sm text-gray-500 mb-6">
        Por {article.author || "CD Estepona Fans"}
      </div>

      <p className="text-lg text-gray-800 leading-relaxed mb-12">
        {article.content}
      </p>

      <Link
        href={`/${params.locale}/noticias`}
        className="inline-block px-4 py-2 rounded text-white bg-[#DC2C20] hover:bg-[#2f36a1] transition-colors duration-200 cursor-pointer"
      >
        ← Volver a todas las noticias
      </Link>
    </main>
  );
}
