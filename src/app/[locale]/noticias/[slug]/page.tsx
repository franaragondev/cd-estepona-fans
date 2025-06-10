import { notFound } from "next/navigation";
import Image from "next/image";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Props = {
  params: { locale: string; slug: string };
};

export default async function NewsDetailPage({ params }: Props) {
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
    </main>
  );
}
