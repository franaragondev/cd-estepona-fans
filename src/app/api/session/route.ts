import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  const loggedIn = !!token && token !== "";

  return NextResponse.json({ loggedIn });
}
