import { NextRequest, NextResponse } from "next/server";
import { getAllSubmissions, markRead, deleteSubmission } from "@/lib/db";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return token === password;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getAllSubmissions.all());
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await request.json();
  markRead.run(id);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await request.json();
  deleteSubmission.run(id);
  return NextResponse.json({ success: true });
}
