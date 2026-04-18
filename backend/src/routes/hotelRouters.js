import express from 'express'
import { createHotel, deleteHotel, getHotels, updateHotel,getHotelById  } from '../controllers/hotelController.js';


const router = express.Router();

router.get("/", getHotels);

router.post("/",createHotel);

router.get("/:id",getHotelById)

router.put("/:id",updateHotel)

router.delete("/:id", deleteHotel)

export default router;