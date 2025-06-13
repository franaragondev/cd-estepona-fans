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

    // Obtener locale desde headers 'accept-language' o usar "es" por defecto
    const acceptLanguage = req.headers.get("accept-language") || "es";
    // Aquí una lógica simple para elegir entre "es" o "en" (puedes adaptar)
    const locale = acceptLanguage.startsWith("en") ? "en" : "es";

    const token = randomUUID();

    await prisma.pendingSubscriber.upsert({
      where: { email },
      update: { token, createdAt: new Date() },
      create: { email, token },
    });

    // Pasamos el locale a la función que envía el email
    await sendConfirmationEmail(email, token, locale);

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
