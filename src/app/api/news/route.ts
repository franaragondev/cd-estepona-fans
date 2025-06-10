import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const take = parseInt(searchParams.get("take") || "9", 10);

  const news = await prisma.news.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return NextResponse.json(news);
}
