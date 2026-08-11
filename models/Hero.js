import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    role: { type: String, default: "" }, // e.g. "Full Stack Developer"
    tagline: { type: String, default: "" }, // short supporting line
    description: { type: String, default: "" }, // longer bio paragraph
    imageUrl: { type: String, default: "" }, // profile / hero image
    resumeUrl: { type: String, default: "" }, // link to resume PDF
    linkedinUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    email: { type: String, default: "" },
    location: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
