import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "My Portfolio" },
    defaultTheme: { type: String, enum: ["light", "dark"], default: "dark" },
    primaryColor: { type: String, default: "#6366f1" } // hex, used to derive CSS variables
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
