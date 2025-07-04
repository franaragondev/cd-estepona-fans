import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { optimizeCloudinaryUrl } from "@/lib/optimizeImage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const take = parseInt(searchParams.get("take") || "9", 10);

  const albumId = "1";

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

  const optimizedNews = news.map((item) => ({
    ...item,
    image: item.image ? optimizeCloudinaryUrl(item.image) : null,
  }));

  return NextResponse.json(optimizedNews);
}
