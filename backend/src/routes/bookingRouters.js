import express from "express";
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getHostBookings,
  getMyBookings,
} from "../controllers/bookingController.js";
import { verifyToken } from "../utils/verifyToken.js";
import { verifyProvider } from "../utils/verifyProvider.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/mine", verifyToken, getMyBookings);
router.get("/host", verifyToken, verifyProvider, getHostBookings);
router.get("/:id", verifyToken, getBookingById);
router.patch("/:id/cancel", verifyToken, cancelBooking);

export default router;
