import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { Resend } from "resend";

const sql = neon(process.env.DATABASE_URL!);

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === process.env.ADMIN_PASSWORD;
}

const VALID_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
type Status = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const [current] = await sql`
    SELECT id, name, email, status FROM contact_inquiries WHERE id = ${id}
  `;
  if (!current) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const newStatus: Status | undefined =
    body.status !== undefined
      ? VALID_STATUSES.includes(body.status)
        ? (body.status as Status)
        : undefined
      : undefined;

  if (body.status !== undefined && newStatus === undefined) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const status = newStatus ?? (current.status as Status);
  const adminNotes =
    body.admin_notes !== undefined
      ? String(body.admin_notes ?? "").trim().slice(0, 2000) || null
      : (current.admin_notes as string | null);

  await sql`
    UPDATE contact_inquiries
    SET status = ${status}, admin_notes = ${adminNotes}
    WHERE id = ${id}
  `;

  // Email client on status transitions that affect them
  if (newStatus && newStatus !== current.status) {
    if (newStatus === "confirmed") {
      await getResend().emails
        .send({
          from: "Kabir Joshi <noreply@kabirj.com>",
          to: current.email as string,
          subject: "Your booking is confirmed — Kabir Joshi Photography",
          text: `Hi ${current.name},\n\nGreat news! Your booking inquiry has been confirmed. I'll follow up shortly with all the details.\n\nLooking forward to it,\nKabir\nkabirj.com`,
        })
        .catch(() => {});
    } else if (newStatus === "cancelled") {
      await getResend().emails
        .send({
          from: "Kabir Joshi <noreply@kabirj.com>",
          to: current.email as string,
          subject: "Regarding your booking inquiry — Kabir Joshi Photography",
          text: `Hi ${current.name},\n\nThank you for reaching out. Unfortunately I'm not available for your requested time. I'd encourage you to check back for future availability or reach out again at hello@kabirj.com.\n\nBest,\nKabir\nkabirj.com`,
        })
        .catch(() => {});
    }
  }

  return Response.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await sql`DELETE FROM contact_inquiries WHERE id = ${id}`;
  return new Response(null, { status: 204 });
}
