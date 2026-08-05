import mongoose from "mongoose";
import imageSchema from "./schemas/Image.js";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Hotel', 'HomeStay'], 
    default: 'Hotel'
  },
  city: { type: String, required: true, trim: true },
  district: { type: String, default: "", trim: true },
  address: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  rating: { type: Number, min: 1, max: 5 },
  reviewCount: { type: Number, min: 0, default: 0 },
  description: { type: String,  trim: true },
  photo: { type: [String], default: [] },
  coverPhoto: { type: imageSchema, default: null},
  photos: { type: [imageSchema], default: [], validate: {
    validator: (images) => images.length <= 10,
    message: "A property can have up to 10 photos",
    },  
  },
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
  bookingEnabled: { type: Boolean, default: true },

  lat: { type: Number },
  lng: { type: Number},

  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'active', 'rejected'], 
    default: 'draft' 
  },
  rejectionReason: { type: String, default: "", trim: true }
}, { timestamps: true });
export default mongoose.model("hotels", hotelSchema);
