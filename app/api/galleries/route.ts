import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS galleries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(200) NOT NULL,
      url TEXT NOT NULL,
      pin VARCHAR(50),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

async function isAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  await ensureTable();
  const rows = await sql`SELECT id, title, url, created_at FROM galleries ORDER BY created_at DESC`;
  return Response.json(rows);
}

export async function POST(request: Request) {
  if (!await isAdmin()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const title = (body.title ?? "").trim().slice(0, 200);
  const url = (body.url ?? "").trim();
  const pin = (body.pin ?? "").trim().slice(0, 50) || null;

  if (!title || !url) {
    return Response.json({ error: "Title and URL required" }, { status: 400 });
  }

  await ensureTable();
  const rows = await sql`
    INSERT INTO galleries (title, url, pin)
    VALUES (${title}, ${url}, ${pin})
    RETURNING id, title, url, pin, created_at
  `;
  return Response.json(rows[0], { status: 201 });
}
