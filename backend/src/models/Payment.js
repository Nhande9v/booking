import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ["vnpay"],
      default: "vnpay",
      required: true,
    },
    txnRef: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ["VND"],
      default: "VND",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "expired", "review_required", "refunded"],
      default: "pending",
      index: true,
    },
    checkoutUrl: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    providerTransactionNo: {
      type: String,
      default: null,
    },
    responseCode: {
      type: String,
      default: null,
    },
    transactionStatus: {
      type: String,
      default: null,
    },
    bankCode: {
      type: String,
      default: null,
    },
    cardType: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

paymentSchema.index(
  { bookingId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "pending" },
  }
);

export default mongoose.model("Payment", paymentSchema);
