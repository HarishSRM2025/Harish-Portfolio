/**
 * Diagnostic: test updateMany on categoryOrder via both Mongoose and raw driver.
 * Run: node --env-file=.env.local scripts/debug-category.js
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log("Connecting to:", MONGODB_URI?.replace(/\/\/.*@/, "//<redacted>@"));

await mongoose.connect(MONGODB_URI);
console.log("Connected.\n");

const db = mongoose.connection.db;
const col = db.collection("skills");

// 1. Show a raw document
const sample = await col.findOne({ category: "Backend" });
console.log("=== RAW sample document (Backend) ===");
console.log(JSON.stringify(sample, null, 2));
console.log();

// 2. Try updateMany via raw driver
console.log("=== Raw driver: updateMany Backend categoryOrder -> 99 ===");
const rawResult = await col.updateMany(
  { category: "Backend" },
  { $set: { categoryOrder: 99 } }
);
console.log("Result:", rawResult);

// 3. Verify via raw driver
const afterRaw = await col.findOne({ category: "Backend" });
console.log("After raw update:", JSON.stringify(afterRaw, null, 2));
console.log();

// 4. Try updateMany via Mongoose model
const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: "General" },
  categoryOrder: { type: Number, default: 0 },
  proficiency: { type: Number, default: 80, min: 0, max: 100 },
  icon: { type: String, default: "Code2" },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Skill = mongoose.model("Skill", SkillSchema);

console.log("=== Mongoose: updateMany Backend categoryOrder -> 42 ===");
const mongooseResult = await Skill.updateMany(
  { category: "Backend" },
  { $set: { categoryOrder: 42 } }
);
console.log("Result:", mongooseResult);

// 5. Verify via Mongoose
const afterMongoose = await Skill.findOne({ category: "Backend" }).select("name category categoryOrder").lean();
console.log("After Mongoose update (lean):", afterMongoose);

const afterMongooseFull = await Skill.findOne({ category: "Backend" }).select("name category categoryOrder");
console.log("After Mongoose update (hydrated):", afterMongooseFull?.toObject());
console.log();

// 6. Verify via raw driver again
const afterAll = await col.findOne({ category: "Backend" });
console.log("Final raw check:", JSON.stringify(afterAll, null, 2));

// 7. Reset back to 0
await col.updateMany({ category: "Backend" }, { $set: { categoryOrder: 0 } });
console.log("\nReset Backend categoryOrder to 0.");

await mongoose.disconnect();
console.log("Done.");
