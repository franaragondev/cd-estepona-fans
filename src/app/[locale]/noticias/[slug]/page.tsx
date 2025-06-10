import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: any) {
  const { slug, locale } = params;

  if (!slug) return notFound();

  const article = await prisma.news.findFirst({
    where: { slug },
    include: { author: true },
  });

  if (!article) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 min-h-[85vh]">
      <h1 className="text-4xl font-bold mb-6 text-[#DC2C20]">
        {article.title}
      </h1>

      <div className="relative w-full h-98 mb-6 rounded overflow-hidden">
        {article.image && (
          <Image
            src={article.image}
            alt={`Imagen de la noticia: ${article.title}`}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      <div className="text-sm text-gray-500 mb-2">
        {new Date(article.createdAt).toLocaleDateString(locale)}
      </div>
      <div className="text-sm text-gray-500 mb-6">
        Por {article.author?.name || "CD Estepona Fans"}
      </div>

      <p className="text-lg text-gray-800 leading-relaxed mb-12">
        {article.content}
      </p>

      <Link
        href={`/${params.locale}/noticias`}
        className="inline-block px-4 py-2 rounded text-white bg-[#DC2C20] hover:bg-[#2f36a1] transition-colors duration-200 cursor-pointer"
      >
        Volver a todas las noticias
      </Link>
    </main>
  );
}
