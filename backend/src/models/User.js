import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Thay vì isAdmin, ta dùng role để quản lý 3 vị trí
    role: { 
      type: String, 
      enum: ["user", "provider", "admin"], 
      default: "user" 
    },
    providerDetails: {
      businessName: { type: String },
      phoneNumber: { type: String },
      address: { type: String },
      identityCard: { type: String }, 
      bankAccount: {
        bankName: String,    
        accountNumber: String, 
        accountName: String    
      },
      isVerified: { type: Boolean, default: true } 
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);