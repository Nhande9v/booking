import mongoose from "mongoose";
import imageSchema from "./schemas/Image.js";

const RoomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null, min: 0 },
    isDiscounted: { type: Boolean, default: false },
    maxPeople: { type: Number, required: true },
    totalRooms: { type: Number, required: true, min: 1, default: 1 },
    desc: { type: String, required: true },
    photo: { type: [String], default: [] },
    coverPhoto: { type: imageSchema, default: null },
    photos: { type: [imageSchema], default: [], validate: {
      validator: (images) => images.length <= 8,
      message: "A room type can have up to 8 photos",
      },
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotels", // Phải khớp với tên model trong Hotel.js
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("rooms", RoomSchema);
