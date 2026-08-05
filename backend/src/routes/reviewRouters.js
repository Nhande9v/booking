import express from "express";
import {
  createReview,
  deleteReview,
  getHotelReviews,
  getMyHotelReview,
  updateReview,
} from "../controllers/reviewController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/hotel/:hotelId", getHotelReviews);
router.get("/hotel/:hotelId/mine", verifyToken, getMyHotelReview);
router.post("/hotel/:hotelId", verifyToken, createReview);
router.patch("/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

export default router;
