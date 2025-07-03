import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifySubscribersOfNewPost } from "@/lib/email";
import { translateText } from "@/lib/deepl";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const take = parseInt(searchParams.get("take") || "9", 10);
  const publishedParam = searchParams.get("published");
  let published: boolean | undefined = undefined;

  if (publishedParam === "true") published = true;
  else if (publishedParam === "false") published = false;

  const news = await prisma.news.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: { author: true, newsAlbum: true },
    where: published !== undefined ? { published } : undefined,
  });

  return NextResponse.json(news);
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const title = form.get("title") as string;
    const slug = form.get("slug") as string;
    const content = form.get("content") as string;
    const authorId = form.get("authorId") as string;
    const image = form.get("image") as string | null;
    const published = form.get("published") === "true";
    const showTitle = form.get("showTitle") === "true";
    const newsAlbumId = form.get("newsAlbumId") as string | null;

    if (!title || !slug || !content || !authorId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const created = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        image,
        authorId,
        published,
        showTitle,
        newsAlbumId: newsAlbumId || undefined,
      },
    });

    if (published) {
      const [titleEN, contentEN, titleFR, contentFR] = await Promise.all([
        translateText(title, "EN"),
        translateText(content, "EN"),
        translateText(title, "FR"),
        translateText(content, "FR"),
      ]);

      await prisma.newsTranslation.createMany({
        data: [
          {
            newsId: created.id,
            language: "en",
            title: titleEN,
            content: contentEN,
          },
          {
            newsId: created.id,
            language: "fr",
            title: titleFR,
            content: contentFR,
          },
        ],
      });

      await notifySubscribersOfNewPost(created.id);
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creando noticia" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const form = await request.formData();
    const id = form.get("id") as string;

    if (!id) {
      return NextResponse.json(
        { error: "ID es obligatorio para actualizar" },
        { status: 400 }
      );
    }

    const title = form.get("title") as string | null;
    const slug = form.get("slug") as string | null;
    const content = form.get("content") as string | null;
    const image = form.get("image") as string | null;
    const published = form.get("published") === "true";
    const showTitleStr = form.get("showTitle") as string | null;
    const newsAlbumId = form.get("newsAlbumId") as string | null;

    const existing = await prisma.news.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    const titleToTranslate = title ?? existing.title;
    const contentToTranslate = content ?? existing.content;

    let newsAlbumIdToUpdate: string | null | undefined;
    if (newsAlbumId === null) {
      newsAlbumIdToUpdate = undefined;
    } else if (newsAlbumId === "") {
      newsAlbumIdToUpdate = null;
    } else {
      newsAlbumIdToUpdate = newsAlbumId;
    }

    const dataToUpdate: any = {};
    if (title !== null) dataToUpdate.title = title;
    if (slug !== null) dataToUpdate.slug = slug;
    if (content !== null) dataToUpdate.content = content;
    if (image !== null) dataToUpdate.image = image;
    if (showTitleStr !== null) dataToUpdate.showTitle = showTitleStr === "true";

    dataToUpdate.published = published;
    dataToUpdate.newsAlbumId = newsAlbumIdToUpdate;

    const updated = await prisma.news.update({
      where: { id },
      data: dataToUpdate,
    });

    if (!existing.published && published) {
      const [titleEN, contentEN, titleFR, contentFR] = await Promise.all([
        translateText(titleToTranslate, "EN"),
        translateText(contentToTranslate, "EN"),
        translateText(titleToTranslate, "FR"),
        translateText(contentToTranslate, "FR"),
      ]);

      await prisma.newsTranslation.createMany({
        data: [
          {
            newsId: updated.id,
            language: "en",
            title: titleEN,
            content: contentEN,
          },
          {
            newsId: updated.id,
            language: "fr",
            title: titleFR,
            content: contentFR,
          },
        ],
        skipDuplicates: true,
      });

      await notifySubscribersOfNewPost(updated.id);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error actualizando noticia" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID es obligatorio para borrar" },
        { status: 400 }
      );
    }

    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ message: "Noticia borrada correctamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error borrando noticia" },
      { status: 500 }
    );
  }
}
