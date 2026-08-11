import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Education from "@/models/Education";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const items = await Education.find().sort({ order: 1, startDate: -1 });
  return NextResponse.json(items);
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const payload = {
      institution: body.institution ?? "",
      degree: body.degree ?? "",
      fieldOfStudy: body.fieldOfStudy ?? "",
      location: body.location ?? "",
      startDate: body.startDate ?? "",
      endDate: body.endDate ?? "",
      grade: String(body.grade ?? ""),
      order: Number(body.order ?? 0)
    };
    const item = await Education.create(payload);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("Education POST error:", err);
    return NextResponse.json({ error: "Failed to create education entry" }, { status: 500 });
  }
}
