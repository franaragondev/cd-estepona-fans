import prisma from "@/lib/prisma";

export async function getPhotos(limit = 6) {
  return await prisma.photo.findMany({
    take: limit,
    orderBy: { id: "desc" },
    where: {
      albumId: {
        not: "4",
      },
    },
  });
}

export async function getAllPhotos() {
  return await prisma.photo.findMany({
    orderBy: { id: "desc" },
    where: {
      albumId: {
        not: "4",
      },
    },
  });
}
