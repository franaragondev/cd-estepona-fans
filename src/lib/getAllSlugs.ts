import prisma from "@/lib/prisma";

export async function getAllSlugs(): Promise<string[]> {
  const news = await prisma.news.findMany({
    select: {
      slug: true,
    },
  });

  return news.map((item) => item.slug);
}
