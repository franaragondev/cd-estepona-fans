import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const config = { api: { bodyParser: false } };

function uploadToCloudinary(buffer: Buffer): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "galeria" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const files = formData.getAll("file");

    if (!files.length) {
      return NextResponse.json(
        { message: "No files uploaded" },
        { status: 400 }
      );
    }

    const blobs = files.filter((f) => f instanceof Blob) as Blob[];

    if (blobs.length === 0) {
      return NextResponse.json(
        { message: "No valid files uploaded" },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (const file of blobs) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadToCloudinary(buffer);

      const savedImage = await prisma.photo.create({
        data: {
          url: result.secure_url,
          album: { connect: { id: "6" } },
        },
      });

      uploadedImages.push({ id: savedImage.id, url: savedImage.url });
    }

    return NextResponse.json({ images: uploadedImages });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    let message = "Upload failed";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ message }, { status: 500 });
  }
}
