import prisma from "@/lib/prisma";
import { optimizeCloudinaryUrl } from "./optimizeImage";

export async function getPhotos(limit = 6) {
  const photos = await prisma.photo.findMany({
    take: limit,
    orderBy: { id: "desc" },
    where: {
      albumId: {
        not: {
          in: ["4", "8"],
        },
      },
    },
  });

  return photos.map((photo) => ({
    ...photo,
    url: optimizeCloudinaryUrl(photo.url),
  }));
}

export async function getAllPhotos() {
  const photos = await prisma.photo.findMany({
    orderBy: { id: "desc" },
    where: {
      albumId: {
        not: {
          in: ["4", "8", "9"],
        },
      },
    },
  });

  return photos.map((photo) => ({
    ...photo,
    url: optimizeCloudinaryUrl(photo.url),
  }));
}

export async function getAcademyPhotos() {
  const photos = await prisma.photo.findMany({
    orderBy: { id: "desc" },
    where: {
      albumId: "9",
    },
  });

  return photos.map((photo) => ({
    ...photo,
    url: optimizeCloudinaryUrl(photo.url),
  }));
}
