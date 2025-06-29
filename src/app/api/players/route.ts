import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      select: {
        id: true,
        name: true,
        photo: true,
        position: true,
        number: true,
        nationality: true,
        stats: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error("Error loading players:", error);
    return new NextResponse("Error loading players", { status: 500 });
  }
}
