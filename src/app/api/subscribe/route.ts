import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.formData();
  const email = data.get("email");
  const honeypot = data.get("honeypot");

  if (honeypot) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Honeypot triggered. Possible bot submission.");
    }
    return NextResponse.json({ message: "bot_detected" }, { status: 400 });
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json({ message: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const dataCenter = process.env.MAILCHIMP_DATA_CENTER;

  if (!apiKey || !listId || !dataCenter) {
    return NextResponse.json(
      { message: "server_error" },
      { status: 500 }
    );
  }

  const mailchimpURL = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members`;
  const encodedApiKey = Buffer.from(`anystring:${apiKey}`).toString("base64");

  try {
    const response = await fetch(mailchimpURL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
      }),
    });

    if (response.ok) {
      return NextResponse.json({ message: "success" });
    } else {
      const error = await response.json();
      if (error.title === "Forgotten Email Not Subscribed") {
        return NextResponse.json({ message: "email_deleted" }, { status: 400 });
      }
      return NextResponse.json({ message: "mailchimp_error" }, { status: 400 });
    }
  } catch (error) {
    console.error("Mailchimp request failed:", error);
    return NextResponse.json(
      { message: "server_error" },
      { status: 500 }
    );
  }
}