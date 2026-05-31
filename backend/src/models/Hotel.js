import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Hotel', 'HomeStay', 'Apartment'], 
    default: 'Hotel'
  },
  city: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  isDiscounted: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5 },
  description: { type: String,  trim: true },
  photo: { type: [String], default: [] },
  languages: { type: [String], default: ["English", "Vietnamese"] },
  amenities: {
    type: [String], 
    default: []
  },
  facilities: {
    hasBreakfast: { type: Boolean, default: false },
    parking: { 
      type: String, 
      enum: ['None', 'Free', 'Paid'], 
      default: 'None' 
    }
  },
  policies: {
    checkIn: {
      from: { type: String, default: "14:00" },
      to: { type: String, default: "00:00" }
    },
    checkOut: {
      from: { type: String, default: "00:00" },
      to: { type: String, default: "12:00" }
    },
    allowChildren: { type: Boolean, default: true },
    allowPets: { type: Boolean, default: false }
  },
  featured: { type: Boolean, default: false },

  lat: { type: Number },
  lng: { type: Number},

  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });
export default mongoose.model("hotels", hotelSchema);