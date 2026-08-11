import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "React"
    category: { type: String, default: "General" }, // e.g. Frontend, Backend, DevOps, Database
    categoryOrder: { type: Number, default: 0 },
    proficiency: { type: Number, default: 80, min: 0, max: 100 },
    icon: { type: String, default: "Code2" }, // lucide-react icon name
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);
// Delete cached model on every import so HMR always picks up schema changes.
// Without this, adding a field (e.g. categoryOrder) to the schema has no effect
// in the running dev server because mongoose.models.Skill still points to the
// old schema, and strict mode silently strips the unknown field from updates.
if (mongoose.models.Skill) {
  delete mongoose.models.Skill;
}

export default mongoose.model("Skill", SkillSchema);
