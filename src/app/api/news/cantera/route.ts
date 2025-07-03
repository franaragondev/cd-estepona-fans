import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const take = parseInt(searchParams.get("take") || "9", 10);

  const albumId = "2";

  const news = await prisma.news.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    where: {
      newsAlbumId: albumId,
    },
    include: {
      author: true,
      translations: true,
    },
  });

  return NextResponse.json(news);
}
