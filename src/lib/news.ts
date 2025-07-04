import prisma from "@/lib/prisma";
import { optimizeCloudinaryUrl } from "./optimizeImage";

export async function getNews(limit = 6) {
  const news = await prisma.news.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
      published: true,
      showTitle: true,
      translations: true,
    },
  });

  return news.map((item) => ({
    ...item,
    image: item.image ? optimizeCloudinaryUrl(item.image) : null,
  }));
}

export async function getAllNews() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, translations: true },
  });

  return news.map((item) => ({
    ...item,
    image: item.image ? optimizeCloudinaryUrl(item.image) : null,
  }));
}
