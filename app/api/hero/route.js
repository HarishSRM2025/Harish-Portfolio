import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Hero from "@/models/Hero";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  let hero = await Hero.findOne();
  if (!hero) hero = await Hero.create({});
  return NextResponse.json(hero);
}

export async function PUT(request) {
  try {
    const body = await request.json();
    await connectDB();

    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create(body);
    } else {
      hero = await Hero.findByIdAndUpdate(hero._id, body, { new: true, runValidators: true });
    }

    return NextResponse.json(hero);
  } catch (err) {
    console.error("Hero PUT error:", err);
    return NextResponse.json({ error: "Failed to update hero section" }, { status: 500 });
  }
}
