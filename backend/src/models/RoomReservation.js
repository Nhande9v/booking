import mongoose from "mongoose";

const roomReservationSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    unit: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

roomReservationSchema.index({ roomId: 1, date: 1, unit: 1 }, { unique: true });
roomReservationSchema.index({ bookingId: 1, roomId: 1, date: 1 });

export default mongoose.model("RoomReservation", roomReservationSchema);
