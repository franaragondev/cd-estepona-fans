import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifySubscribersOfMatchUpdate } from "@/lib/email";

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        team: true,
      },
      orderBy: {
        date: "asc",
      },
    });
    return NextResponse.json(matches);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener partidos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, teamId, isHome, competition, score } = body;

    if (!teamId || !competition) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const match = await prisma.match.create({
      data: {
        date: date ? new Date(date) : null,
        teamId,
        isHome,
        competition,
        score: score || null,
      },
      include: {
        team: true,
      },
    });

    // await notifySubscribersOfMatchUpdate(match, false);

    return NextResponse.json(match);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear el partido" },
      { status: 500 }
    );
  }
}
