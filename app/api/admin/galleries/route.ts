import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (session?.value !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await sql`SELECT * FROM galleries ORDER BY created_at DESC`;
  return Response.json(rows);
}
