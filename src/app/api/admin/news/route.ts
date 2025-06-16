import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const take = parseInt(searchParams.get("take") || "9", 10);

  const news = await prisma.news.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: { author: true },
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
      },
    });

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
    const title = form.get("title") as string;
    const slug = form.get("slug") as string;
    const content = form.get("content") as string;
    const image = form.get("image") as string | null;

    if (!id) {
      return NextResponse.json(
        { error: "ID es obligatorio para actualizar" },
        { status: 400 }
      );
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        image,
      },
    });

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
