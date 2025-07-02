import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTimezoneOffset } from "date-fns-tz";

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

  const startLocal = new Date(year, month, 1, 0, 0, 0);
  const endLocal = new Date(year, month + 1, 1, 0, 0, 0);

  const offsetStart = getTimezoneOffset(timeZone, startLocal);
  const offsetEnd = getTimezoneOffset(timeZone, endLocal);

  const startDateUtc = new Date(startLocal.getTime() - offsetStart);
  const endDateUtc = new Date(endLocal.getTime() - offsetEnd);

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
