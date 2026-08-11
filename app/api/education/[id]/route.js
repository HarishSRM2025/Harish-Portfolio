import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Education from "@/models/Education";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
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

    const item = await Education.findByIdAndUpdate(
      params.id,
      { $set: payload },
      { new: true, runValidators: true }
    );
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    console.error("Education PUT error:", err);
    return NextResponse.json({ error: "Failed to update education entry" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();
    await Education.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Education DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete education entry" }, { status: 500 });
  }
}
