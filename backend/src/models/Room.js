import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    price: { type: Number, required: true },
    maxPeople: { type: Number, required: true },
    desc: { type: String, required: true },
    photo: { type: [String] }, 
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotels", // Phải khớp với tên model trong Hotel.js
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("rooms", RoomSchema);