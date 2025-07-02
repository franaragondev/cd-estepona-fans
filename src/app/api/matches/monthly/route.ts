import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { toZonedTime } from "date-fns-tz";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const year = Number(url.searchParams.get("year"));
  const month = Number(url.searchParams.get("month")); // 0-based

  if (isNaN(year) || isNaN(month)) {
    return NextResponse.json(
      { error: "Year and month query params required" },
      { status: 400 }
    );
  }

  const timeZone = "Europe/Madrid";

  // Fecha en Madrid a las 00:00 del primer día del mes
  const startDateMadrid = new Date(year, month, 1, 0, 0, 0);
  const startDateUtc = toZonedTime(startDateMadrid, timeZone);

  // Fecha en Madrid a las 00:00 del primer día del mes siguiente
  const endDateMadrid = new Date(year, month + 1, 1, 0, 0, 0);
  const endDateUtc = toZonedTime(endDateMadrid, timeZone);

  const matches = await prisma.match.findMany({
    where: {
      date: {
        gte: startDateUtc,
        lt: endDateUtc,
      },
    },
    include: {
      team: true,
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(matches);
}
