import { NextRequest, NextResponse } from "next/server";
import { notifySubscribersOfNewPost } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const newsId = searchParams.get("newsId");

  if (!newsId) {
    return NextResponse.json({ error: "Falta newsId" }, { status: 400 });
  }

  try {
    await notifySubscribersOfNewPost(newsId);
    return NextResponse.json({ status: "ok", newsId });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al enviar email" },
      { status: 500 }
    );
  }
}
