import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const albums = await prisma.newsAlbum.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(albums);
  } catch (error) {
    console.error("Error fetching news albums:", error);
    return NextResponse.json(
      { error: "Error fetching news albums" },
      { status: 500 }
    );
  }
}
