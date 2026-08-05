import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    storageKey: { type: String, default: "", trim: true },
    provider: { type: String, enum: ["cloudinary", "s3", "external"], default: "cloudinary" },
    width: { type: Number, min: 1 },
    height: { type: Number, min: 1 },
    format: { type: String, trim: true },
    bytes: { type: Number, min: 0 },
  },
  { _id: false }
);

export default imageSchema;