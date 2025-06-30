import prisma from "@/lib/prisma";

export async function getNews(limit = 6) {
  return await prisma.news.findMany({
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
}

export async function getAllNews() {
  return await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, translations: true },
  });
}
