import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 5 },
  description: { type: String,  trim: true },
  photo: { type: [String], default: [] },
  amenities: {
    type: [String], 
    default: []
  },
  featured: { type: Boolean, default: false },
  // thêm cái này để làm map
  lat: { type: Number },
  lng: { type: Number},
});
export default mongoose.model("hotels", hotelSchema);