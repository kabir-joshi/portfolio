import { neon } from "@neondatabase/serverless";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
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
  const rows = await sql`
    SELECT * FROM event_announcements WHERE active = TRUE ORDER BY created_at DESC LIMIT 1
  `;
  return Response.json(rows[0] ?? null);
}
