import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema(
  {
    heading: { type: String, default: "About Me" },
    description: { type: String, default: "" }, // supports plain text / paragraphs
    yearsOfExperience: { type: Number, default: 0 },
    highlights: { type: [String], default: [] } // short bullet facts
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model("About", AboutSchema);
