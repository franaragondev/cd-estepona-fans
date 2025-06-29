import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Group MVPs by playerId and count how many times each player has been selected
    const grouped = await prisma.mVP.groupBy({
      by: ["playerId"],
      _count: { playerId: true },
      orderBy: { _count: { playerId: "desc" } },
    });

    // Extract player IDs from the grouped result
    const playerIds = grouped.map((entry) => entry.playerId);

    // Fetch player details based on the extracted IDs
    const players = await prisma.player.findMany({
      where: { id: { in: playerIds } },
    });

    // Merge count data with player details
    const playersWithMVPs = grouped.map((entry) => {
      const player = players.find((p) => p.id === entry.playerId);
      return {
        id: player!.id,
        name: player!.name,
        photo: player!.photo ?? "/default-player.png",
        mvps: entry._count.playerId,
      };
    });

    // Sort players: first by MVP count (desc), then alphabetically by name in case of tie
    playersWithMVPs.sort((a, b) => {
      if (b.mvps !== a.mvps) return b.mvps - a.mvps;
      return a.name.localeCompare(b.name);
    });

    // Get top 3 players and the rest
    const top3 = playersWithMVPs.slice(0, 3);
    const others = playersWithMVPs.slice(3);

    // Return result as JSON
    return NextResponse.json({ top3, others });
  } catch (error) {
    console.error("Error loading MVPs:", error);
    return new NextResponse("Error loading MVPs", { status: 500 });
  }
}
