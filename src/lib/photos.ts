import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPhotos(limit = 6) {
  return await prisma.photo.findMany({
    take: limit,
    orderBy: { id: "desc" },
  });
}
