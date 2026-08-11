import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Experience from "@/models/Experience";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  await connectDB();
  const item = await Experience.findById(params.id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    await connectDB();
    const item = await Experience.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true
    });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    console.error("Experience PUT error:", err);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  const item = await Experience.findByIdAndDelete(params.id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
