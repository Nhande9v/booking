import express from "express";
import { getHotelRooms, getRoomById } from "../controllers/roomController.js";

const router = express.Router();

router.get("/hotel/:hotelId", getHotelRooms);
router.get("/:id", getRoomById);
export default router;