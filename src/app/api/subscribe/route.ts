import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.create({
      data: { email, name: name || null },
    });

    return NextResponse.json({
      message: "Subscribed successfully",
      subscriber,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Unique constraint failed
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
