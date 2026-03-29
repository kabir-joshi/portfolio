import { NextRequest, NextResponse } from "next/server";
import { insertSubmission } from "@/lib/db";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  const { name, email, session, date, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Always save to DB
  insertSubmission.run(name, email, session ?? "Event Coverage", date ?? null, message);

  // Send email notification if Resend is configured
  if (resend) {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "mail@kabirj.com",
      replyTo: email,
      subject: `New booking inquiry — ${session}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Session: ${session}`,
        `Preferred date: ${date || "Flexible"}`,
        ``,
        `Message:`,
        message,
      ].join("\n"),
    });
  }

  return NextResponse.json({ success: true });
}
