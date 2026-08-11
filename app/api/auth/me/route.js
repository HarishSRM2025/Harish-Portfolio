import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/requireAdmin";

export async function GET() {
  const admin = getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ admin });
}
