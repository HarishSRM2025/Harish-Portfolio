import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactInfo from "@/models/ContactInfo";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  let info = await ContactInfo.findOne();
  if (!info) info = await ContactInfo.create({});
  return NextResponse.json(info);
}

export async function PUT(request) {
  try {
    const body = await request.json();
    await connectDB();

    let info = await ContactInfo.findOne();
    if (!info) {
      info = await ContactInfo.create(body);
    } else {
      info = await ContactInfo.findByIdAndUpdate(info._id, body, {
        new: true,
        runValidators: true
      });
    }

    return NextResponse.json(info);
  } catch (err) {
    console.error("ContactInfo PUT error:", err);
    return NextResponse.json({ error: "Failed to update contact info" }, { status: 500 });
  }
}
