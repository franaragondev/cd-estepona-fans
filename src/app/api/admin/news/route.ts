import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifySubscribersOfNewPost } from "@/lib/email";

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
    include: { author: true },
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
      },
    });

    if (published) {
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

    const title = form.get("title") as string;
    const slug = form.get("slug") as string;
    const content = form.get("content") as string;
    const image = form.get("image") as string;
    const published = form.get("published") === "true";
    const showTitleStr = form.get("showTitle") as string | null;

    const existing = await prisma.news.findUnique({ where: { id } });
    const dataToUpdate: any = {};
    if (title) dataToUpdate.title = title;
    if (slug) dataToUpdate.slug = slug;
    if (content) dataToUpdate.content = content;
    if (image) dataToUpdate.image = image;

    dataToUpdate.published = published;

    if (showTitleStr !== null) {
      dataToUpdate.showTitle = showTitleStr === "true";
    }

    const updated = await prisma.news.update({
      where: { id },
      data: dataToUpdate,
    });

    if (!existing?.published && published) {
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
    return NextResponse.json(
      { error: "Error borrando noticia" },
      { status: 500 }
    );
  }
}
