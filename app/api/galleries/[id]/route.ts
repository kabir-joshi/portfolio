import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

const sql = neon(process.env.DATABASE_URL!);

async function isAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === process.env.ADMIN_PASSWORD;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { password } = await request.json();

  const rows = await sql`SELECT url, gallery_password FROM galleries WHERE id = ${id}`;
  if (rows.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const gallery = rows[0];
  if (gallery.gallery_password !== password) {
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }

  return Response.json({ url: gallery.url });
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

  const title = (body.title ?? "").trim().slice(0, 200);
  const url = (body.url ?? "").trim();
  const pin = (body.pin ?? "").trim().slice(0, 50) || null;
  const galleryPassword = (body.gallery_password ?? "").trim().slice(0, 100) || null;
  const date = body.date;

  if (!title || !url) {
    return Response.json({ error: "Title and URL required" }, { status: 400 });
  }
  if (!date || isNaN(Date.parse(date))) {
    return Response.json({ error: "Invalid date" }, { status: 400 });
  }

  await sql`
    UPDATE galleries
    SET
      title = ${title},
      url = ${url},
      pin = ${pin},
      gallery_password = ${galleryPassword},
      created_at = ${new Date(date).toISOString()}
    WHERE id = ${id}
  `;
  return Response.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAdmin()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await sql`DELETE FROM galleries WHERE id = ${id}`;
  return new Response(null, { status: 204 });
}
