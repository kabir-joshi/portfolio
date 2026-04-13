import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(200) NOT NULL,
      session_type VARCHAR(100) NOT NULL,
      preferred_date VARCHAR(200),
      message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET() {
  await ensureTable();
  const rows = await sql`SELECT * FROM contact_inquiries ORDER BY created_at DESC`;
  return Response.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();

  const name = (body.name ?? "").trim().slice(0, 100);
  const email = (body.email ?? "").trim().slice(0, 200);
  const sessionType = (body.session_type ?? "").trim().slice(0, 100);
  const preferredDate = (body.preferred_date ?? "").trim().slice(0, 200);
  const message = (body.message ?? "").trim().slice(0, 2000);

  if (!name || !email || !sessionType) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  await ensureTable();
  await sql`
    INSERT INTO contact_inquiries (name, email, session_type, preferred_date, message)
    VALUES (${name}, ${email}, ${sessionType}, ${preferredDate}, ${message})
  `;

  return Response.json({ ok: true }, { status: 201 });
}
