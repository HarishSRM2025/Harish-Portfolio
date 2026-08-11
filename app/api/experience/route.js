import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Experience from "@/models/Experience";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const items = await Experience.find().sort({ order: 1, startDate: -1 });
  return NextResponse.json(items);
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const item = await Experience.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("Experience POST error:", err);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
