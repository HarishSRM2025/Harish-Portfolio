import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const items = await Project.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(items);
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const item = await Project.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("Project POST error:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
