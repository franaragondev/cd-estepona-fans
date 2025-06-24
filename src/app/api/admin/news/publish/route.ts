import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifySubscribersOfNewPost } from "@/lib/email";

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
    const updated = await prisma.news.update({
      where: { id },
      data: { published: true },
    });

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
