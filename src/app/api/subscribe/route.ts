import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import sendConfirmationEmail from "@/lib/sendConfirmationEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 1. Comprueba si ya está confirmado
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Email already confirmed" },
        { status: 409 }
      );
    }

    // 2. Crear o actualizar token para pendiente
    const token = randomUUID();
    await prisma.pendingSubscriber.upsert({
      where: { email },
      update: { token, createdAt: new Date() },
      create: { email, token },
    });

    // 3. Enviar email de confirmación
    await sendConfirmationEmail(email, token);

    return NextResponse.json({
      message:
        "Confirmation email sent. Please check your inbox to confirm subscription.",
    });
  } catch (error: unknown) {
    console.error("Error in POST /api/subscribe:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Email already pending confirmation" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
