import express from 'express'
import { createHotel, deleteHotel, getHotels, updateHotel,getHotelById  } from '../controllers/hotelController.js';
import { verifyProvider } from '../utils/verifyProvider.js';
import {verifyToken} from '../utils/verifyToken.js';

const router = express.Router();

router.get("/", getHotels);

router.get("/:id",getHotelById)

router.post("/", verifyToken, verifyProvider, createHotel);

router.put("/:id",verifyToken, verifyProvider, updateHotel)

router.delete("/:id", verifyToken, verifyProvider, deleteHotel)

export default router;