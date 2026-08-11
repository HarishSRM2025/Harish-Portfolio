import mongoose from "mongoose";

const ContactInfoSchema = new mongoose.Schema(
  {
    heading: { type: String, default: "Let's Work Together" },
    description: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    twitterUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models.ContactInfo || mongoose.model("ContactInfo", ContactInfoSchema);
