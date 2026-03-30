import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "reviews.json");

interface Review {
  id: string;
  name: string;
  rating: number;
  body: string;
  createdAt: string;
}

async function readReviews(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Review[];
  } catch {
    return [];
  }
}

async function writeReviews(reviews: Review[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(reviews, null, 2), "utf-8");
}

export async function GET() {
  const reviews = await readReviews();
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

  const review: Review = {
    id: crypto.randomUUID(),
    name,
    rating,
    body: reviewBody,
    createdAt: new Date().toISOString(),
  };

  const reviews = await readReviews();
  reviews.unshift(review);
  await writeReviews(reviews);

  return Response.json(review, { status: 201 });
}
