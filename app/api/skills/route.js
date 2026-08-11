import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const items = await Skill.find().sort({ categoryOrder: 1, category: 1, order: 1 });
  return NextResponse.json(items);
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const item = await Skill.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("Skill POST error:", err);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
