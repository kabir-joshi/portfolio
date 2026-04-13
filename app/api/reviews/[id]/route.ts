import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

const sql = neon(process.env.DATABASE_URL!);

async function isAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === process.env.ADMIN_PASSWORD;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAdmin()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const name = (body.name ?? "").trim().slice(0, 100);
  const reviewBody = (body.body ?? "").trim().slice(0, 1000);
  const event = (body.event ?? "").trim().slice(0, 200) || null;
  const rating = Number(body.rating);

  if (!name || !reviewBody || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const rows = await sql`
    UPDATE reviews
    SET name = ${name}, body = ${reviewBody}, rating = ${rating}, event = ${event}
    WHERE id = ${id}
    RETURNING id, name, rating, body, event, created_at
  `;

  if (rows.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(rows[0]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAdmin()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await sql`DELETE FROM reviews WHERE id = ${id}`;
  return new Response(null, { status: 204 });
}
