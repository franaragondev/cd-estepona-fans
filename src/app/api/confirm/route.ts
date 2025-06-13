import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const pending = await prisma.pendingSubscriber.findUnique({
      where: { token },
    });

    if (!pending) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 }
      );
    }

    await prisma.subscriber.create({
      data: { email: pending.email },
    });

    await prisma.pendingSubscriber.delete({
      where: { id: pending.id },
    });

    const locale = "es"; // o hardcodeado aquí, o podrías intentar sacar del host/headers si tienes multi-locale

    return NextResponse.redirect(
      new URL(`/${locale}/?confirmed=true`, req.url)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
