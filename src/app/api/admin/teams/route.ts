import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener equipos" },
      { status: 500 }
    );
  }
}
