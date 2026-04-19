import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return jar.get("admin_session")?.value === ADMIN_PASSWORD;
}

export async function GET() {
  if (!(await isAuthed())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    CREATE TABLE IF NOT EXISTS page_views (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      path VARCHAR(500) NOT NULL,
      referrer VARCHAR(1000),
      ua VARCHAR(500),
      ip VARCHAR(100),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const [totals, topPages, recent] = await Promise.all([
    sql`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day')  AS today,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS week,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS month,
        COUNT(*) AS all_time
      FROM page_views
    `,
    sql`
      SELECT path, COUNT(*) AS views
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY path
      ORDER BY views DESC
      LIMIT 10
    `,
    sql`
      SELECT path, referrer, ua, ip, created_at
      FROM page_views
      ORDER BY created_at DESC
      LIMIT 25
    `,
  ]);

  return Response.json({
    totals: totals[0],
    topPages,
    recent,
  });
}
