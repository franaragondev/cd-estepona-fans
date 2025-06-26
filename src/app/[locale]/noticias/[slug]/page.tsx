import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import NewsButton from "@/components/CommonButton";
import SubscribeModal from "@/components/SubscribeModal";
import { linkify } from "@/utils/linkify";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: any) {
  const { slug, locale } = params;

  if (!slug) return notFound();

  const article = await prisma.news.findFirst({
    where: { slug },
    include: { author: true },
  });

  if (!article) return notFound();

  const neutralDark = "#333";
  const neutralGray = "#666";

  return (
    <>
      <SubscribeModal />

      <main className="max-w-3xl mx-auto px-4 py-12 min-h-[85vh]">
        <h1 className="text-4xl font-bold mb-6" style={{ color: neutralDark }}>
          {article.title}
        </h1>

        <div className="w-full rounded overflow-hidden flex justify-center">
          {article.image && (
            <Image
              src={article.image}
              alt={`Imagen de la noticia: ${article.title}`}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              priority
            />
          )}
        </div>

        <div
          className="text-sm mb-2"
          style={{ color: neutralGray, fontWeight: 500 }}
        >
          {new Date(article.createdAt).toLocaleDateString(locale)}
        </div>
        <div
          className="text-sm mb-6"
          style={{ color: neutralGray, fontStyle: "italic" }}
        >
          Por {article.author?.name || "CD Estepona Fans"}
        </div>

        <div
          className="text-lg leading-relaxed mb-12"
          style={{ color: neutralDark, opacity: 0.85, whiteSpace: "pre-wrap" }}
        >
          {linkify(article.content)}
        </div>
        <NewsButton
          href={`/${params.locale}/noticias`}
          className="inline-block px-4 py-2 rounded text-white bg-[#2f36a1] hover:bg-[#DC2C20] transition-colors duration-200 cursor-pointer"
          buttonTitle="button"
          translation="newsPage"
        />
      </main>
    </>
  );
}
