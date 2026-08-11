import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    grade: { type: String, default: "" },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

if (mongoose.models.Education) {
  delete mongoose.models.Education;
}

export default mongoose.model("Education", EducationSchema);
