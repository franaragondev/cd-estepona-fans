import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifySubscribersOfMatchUpdate } from "@/lib/email";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { date, teamId, isHome, competition, score } = body;

    if (!date || !teamId || !competition) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const match = await prisma.match.update({
      where: { id: params.id },
      data: {
        date: new Date(date),
        teamId,
        isHome,
        competition,
        score: score || null,
      },
      include: {
        team: true,
      },
    });

    await notifySubscribersOfMatchUpdate(match, true);

    return NextResponse.json(match);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar el partido" },
      { status: 500 }
    );
  }
}
