import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  await connectDB();
  const item = await Skill.findById(params.id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    await connectDB();
    const item = await Skill.findByIdAndUpdate(params.id, { $set: body }, {
      new: true,
      runValidators: true
    });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    console.error("Skill PUT error:", err);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  const item = await Skill.findByIdAndDelete(params.id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
