import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (session?.value === process.env.ADMIN_PASSWORD) {
    return Response.json({ ok: true });
  }
  return Response.json({ ok: false }, { status: 401 });
}
