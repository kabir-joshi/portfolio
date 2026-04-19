import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

async function isAuthed() {
  const jar = await cookies();
  return jar.get("admin_session")?.value === process.env.ADMIN_PASSWORD;
}

function db() {
  return neon(process.env.DATABASE_URL!);
}

export async function GET() {
  if (!(await isAuthed())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const sql = db();
  await sql`
    CREATE TABLE IF NOT EXISTS event_announcements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(200) NOT NULL,
      subtitle VARCHAR(500),
      event_date VARCHAR(100),
      location VARCHAR(200),
      cta_text VARCHAR(100),
      cta_link VARCHAR(500),
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  const rows = await sql`SELECT * FROM event_announcements ORDER BY created_at DESC`;
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!(await isAuthed())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const sql = db();

  const title = (body.title ?? "").trim().slice(0, 200);
  const subtitle = (body.subtitle ?? "").trim().slice(0, 500);
  const event_date = (body.event_date ?? "").trim().slice(0, 100);
  const location = (body.location ?? "").trim().slice(0, 200);
  const cta_text = (body.cta_text ?? "").trim().slice(0, 100);
  const cta_link = (body.cta_link ?? "").trim().slice(0, 500);

  if (!title) return Response.json({ error: "Title required" }, { status: 400 });

  await sql`UPDATE event_announcements SET active = FALSE WHERE active = TRUE`;

  const [row] = await sql`
    INSERT INTO event_announcements (title, subtitle, event_date, location, cta_text, cta_link, active)
    VALUES (${title}, ${subtitle}, ${event_date}, ${location}, ${cta_text}, ${cta_link}, TRUE)
    RETURNING *
  `;
  return Response.json(row, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!(await isAuthed())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id, active } = await request.json();
  const sql = db();

  if (active === true) {
    await sql`UPDATE event_announcements SET active = FALSE WHERE active = TRUE AND id != ${id}`;
  }

  const [row] = await sql`
    UPDATE event_announcements SET active = ${active} WHERE id = ${id} RETURNING *
  `;
  return Response.json(row);
}

export async function DELETE(request: Request) {
  if (!(await isAuthed())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  const sql = db();
  await sql`DELETE FROM event_announcements WHERE id = ${id}`;
  return Response.json({ ok: true });
}
