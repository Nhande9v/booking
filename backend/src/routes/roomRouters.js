import express from "express";
import {
  createRoom,
  deleteRoom,
  getHotelRooms,
  getDiscountedRooms,
  getRoomById,
  updateRoom,
  updateRoomPricing,
  setRoomBookingEnabled,
} from "../controllers/roomController.js";
import { verifyProvider } from "../utils/verifyProvider.js";
import { verifyToken } from "../utils/verifyToken.js";
import { optionalVerifyToken } from "../utils/optionalVerifyToken.js";
const router = express.Router();

router.get("/discounted", getDiscountedRooms);
router.get("/hotel/:hotelId", optionalVerifyToken, getHotelRooms);
router.get("/:id", optionalVerifyToken, getRoomById);
router.post("/", verifyToken, verifyProvider, createRoom);
router.patch("/:id/pricing", verifyToken, verifyProvider, updateRoomPricing);
router.patch("/:id/booking-availability", verifyToken, verifyProvider, setRoomBookingEnabled);
router.put("/:id", verifyToken, verifyProvider, updateRoom);
router.delete("/:id", verifyToken, verifyProvider, deleteRoom);

export default router;
