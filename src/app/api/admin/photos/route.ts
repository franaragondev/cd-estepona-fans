import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const albumId = url.searchParams.get("albumId");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "12");

  const whereFilter = albumId
    ? { albumId, NOT: { albumId: { in: ["4", "8"] } } }
    : { NOT: { albumId: { in: ["4", "8"] } } };

  const photos = await prisma.photo.findMany({
    where: whereFilter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { id: "desc" },
  });

  const total = await prisma.photo.count({ where: whereFilter });

  return NextResponse.json({ photos, total, page, limit });
}

export async function DELETE(request: Request) {
  try {
    const { photoIds } = await request.json();

    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return NextResponse.json(
        { message: "photoIds array required" },
        { status: 400 }
      );
    }

    const photos = await prisma.photo.findMany({
      where: { id: { in: photoIds } },
    });

    await Promise.all(
      photos.map(async (photo) => {
        const publicIdMatch = photo.url.match(/\/galeria\/([^\.]+)\./);
        const publicId = publicIdMatch ? `galeria/${publicIdMatch[1]}` : null;
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      })
    );

    await prisma.photo.deleteMany({
      where: { id: { in: photoIds } },
    });

    return NextResponse.json({
      message: "Photos deleted",
      deletedCount: photos.length,
    });
  } catch (error) {
    console.error("Error deleting photos:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
