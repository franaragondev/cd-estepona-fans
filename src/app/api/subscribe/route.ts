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

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "El correo ya ha sido confirmado" },
        { status: 409 }
      );
    }

    const token = randomUUID();
    await prisma.pendingSubscriber.upsert({
      where: { email },
      update: { token, createdAt: new Date() },
      create: { email, token },
    });

    await sendConfirmationEmail(email, token);

    return NextResponse.json({
      message:
        "Correo de confirmación enviado. Por favor, revisa tu bandeja de entrada para confirmar la suscripción.",
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
        { error: "El correo ya está pendiente de confirmación" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
