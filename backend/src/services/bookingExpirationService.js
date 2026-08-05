import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

const DEFAULT_INTERVAL_MS = 60 * 1000;

export const expirePendingBookings = async (now = new Date()) => {
  const expiringBookings = await Booking.find({
    status: "pending",
    paymentStatus: { $in: ["unpaid", "pending", "failed"] },
    expiresAt: { $ne: null, $lte: now },
  }).select("_id");
  const bookingIds = expiringBookings.map((booking) => booking._id);

  if (!bookingIds.length) return 0;

  const result = await Booking.updateMany(
    {
      _id: { $in: bookingIds },
      status: "pending",
    },
    {
      $set: {
        status: "expired",
        expiredAt: now,
        expiresAt: null,
      },
    }
  );

  await Payment.updateMany(
    { bookingId: { $in: bookingIds }, status: "pending" },
    { $set: { status: "expired" } }
  );

  return result.modifiedCount;
};

export const startBookingExpirationJob = () => {
  const intervalMs = Math.max(
    Number(process.env.BOOKING_EXPIRATION_INTERVAL_MS) || DEFAULT_INTERVAL_MS,
    10 * 1000
  );

  const run = async () => {
    try {
      const expiredCount = await expirePendingBookings();
      if (expiredCount > 0) {
        console.log(`Expired ${expiredCount} pending booking(s).`);
      }
    } catch (error) {
      console.error("Booking expiration job failed:", error.message);
    }
  };

  void run();
  const timer = setInterval(run, intervalMs);
  timer.unref();
  return timer;
};
