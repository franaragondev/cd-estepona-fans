import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  const matches = await prisma.match.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      team: true,
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(matches);
}
