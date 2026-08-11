import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import About from "@/models/About";

export const dynamic = "force-dynamic";

const fallbackAbout = {
  heading: "About Me",
  description: "",
  yearsOfExperience: 0,
  highlights: []
};

export async function GET() {
  try {
    await connectDB();
    let about = await About.findOne().lean();
    if (!about) {
      return NextResponse.json(fallbackAbout);
    }

    return NextResponse.json(about);
  } catch (err) {
    console.error("About GET error:", err);
    return NextResponse.json(fallbackAbout);
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    await connectDB();

    const safeBody = { ...fallbackAbout, ...(body || {}) };
    let about = await About.findOne();
    if (!about) {
      about = await About.create(safeBody);
    } else {
      about = await About.findByIdAndUpdate(about._id, safeBody, { new: true, runValidators: true });
    }

    return NextResponse.json(about);
  } catch (err) {
    console.error("About PUT error:", err);
    return NextResponse.json(fallbackAbout, { status: 500 });
  }
}
