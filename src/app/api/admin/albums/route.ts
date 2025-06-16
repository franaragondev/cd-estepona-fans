import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const take = parseInt(searchParams.get("take") || "12", 10);

    const albums = await prisma.photoAlbum.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true },
    });

    const total = await prisma.photoAlbum.count();

    return NextResponse.json({ albums, total });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching albums" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Título requerido" }, { status: 400 });
    }

    const newAlbum = await prisma.photoAlbum.create({
      data: { title: title.trim(), description: description?.trim() || null },
    });

    return NextResponse.json({ album: newAlbum }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creando álbum" }, { status: 500 });
  }
}
