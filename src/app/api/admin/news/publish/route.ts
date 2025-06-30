import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifySubscribersOfNewPost } from "@/lib/email";
import { translateText } from "@/lib/deepl";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID es obligatorio para publicar" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.news.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    const updated = await prisma.news.update({
      where: { id },
      data: { published: true },
    });

    const existingTranslations = await prisma.newsTranslation.findMany({
      where: { newsId: id },
    });

    if (existingTranslations.length === 0) {
      const [titleEN, contentEN, titleFR, contentFR] = await Promise.all([
        translateText(existing.title, "EN"),
        translateText(existing.content, "EN"),
        translateText(existing.title, "FR"),
        translateText(existing.content, "FR"),
      ]);

      await prisma.newsTranslation.createMany({
        data: [
          {
            newsId: id,
            language: "en",
            title: titleEN,
            content: contentEN,
          },
          {
            newsId: id,
            language: "fr",
            title: titleFR,
            content: contentFR,
          },
        ],
      });
    }

    await notifySubscribersOfNewPost(id);

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error publicando noticia" },
      { status: 500 }
    );
  }
}
