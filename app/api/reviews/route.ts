import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

interface Review {
  id: string;
  name: string;
  rating: number;
  body: string;
  createdAt: string;
}

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      body VARCHAR(1000) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET() {
  await ensureTable();
  const rows = await sql`SELECT * FROM reviews ORDER BY created_at DESC`;
  const reviews: Review[] = rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    rating: r.rating as number,
    body: r.body as string,
    createdAt: r.created_at as string,
  }));
  return Response.json(reviews);
}

export async function POST(request: Request) {
  const body = await request.json();

  const name = (body.name ?? "").trim().slice(0, 100);
  const reviewBody = (body.body ?? "").trim().slice(0, 1000);
  const rating = Number(body.rating);

  if (!name || !reviewBody || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  await ensureTable();
  const rows = await sql`
    INSERT INTO reviews (name, rating, body)
    VALUES (${name}, ${rating}, ${reviewBody})
    RETURNING id, name, rating, body, created_at
  `;
  const row = rows[0];
  const review: Review = {
    id: row.id as string,
    name: row.name as string,
    rating: row.rating as number,
    body: row.body as string,
    createdAt: row.created_at as string,
  };
  return Response.json(review, { status: 201 });
}
