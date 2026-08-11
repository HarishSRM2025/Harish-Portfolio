import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export const dynamic = "force-dynamic";

// Public: visitors submit the contact form.
export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const item = await Contact.create({ name, email, subject, message });
    return NextResponse.json({ message: "Message sent", item }, { status: 201 });
  } catch (err) {
    console.error("Contact POST error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// Admin: list all received messages, newest first.
export async function GET() {
  await connectDB();
  const items = await Contact.find().sort({ createdAt: -1 });
  return NextResponse.json(items);
}
