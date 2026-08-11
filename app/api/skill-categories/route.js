import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const categories = await Skill.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$category", "General"] },
        categoryOrder: { $min: { $ifNull: ["$categoryOrder", 0] } },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        categoryOrder: 1,
        count: 1
      }
    },
    { $sort: { categoryOrder: 1, name: 1 } }
  ]);
  return NextResponse.json(categories);
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const category = String(body.category || "").trim();
    const categoryOrder = Number(body.categoryOrder ?? 0);

    console.log("[skill-categories PUT] Received:", { category, categoryOrder });

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    await connectDB();

    // The aggregation groups null/missing categories under "General" via $ifNull,
    // so the update filter must also match those documents.
    const filter =
      category === "General"
        ? { $or: [{ category: "General" }, { category: null }, { category: { $exists: false } }] }
        : { category };

    console.log("[skill-categories PUT] Filter:", JSON.stringify(filter));

    const result = await Skill.updateMany(filter, { $set: { categoryOrder } }, { runValidators: true });

    console.log("[skill-categories PUT] UpdateMany result:", {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      acknowledged: result.acknowledged
    });

    // Verify: re-read one skill in this category
    const verify = await Skill.findOne(filter).select("name category categoryOrder").lean();
    console.log("[skill-categories PUT] Verify after update:", verify);

    return NextResponse.json({ message: "Updated", category, categoryOrder, matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Category order PUT error:", err);
    return NextResponse.json({ error: "Failed to update category order" }, { status: 500 });
  }
}
