import express from "express";
import {
  createHotel,
  deleteHotel,
  getHotelById,
  getHotels,
  getMyHotels,
  previewHotelCoordinates,
  getReviewHotels,
  reviewHotel,
  setHotelFeatured,
  refreshHotelCoordinates,
  submitHotelForReview,
  updateHotel,
  withdrawHotelReview,
} from "../controllers/hotelController.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";
import { verifyProvider } from "../utils/verifyProvider.js";
import { verifyToken } from "../utils/verifyToken.js";
import { optionalVerifyToken } from "../utils/optionalVerifyToken.js";

const router = express.Router();

router.get("/", getHotels);
router.get("/mine", verifyToken, verifyProvider, getMyHotels);
router.get("/review", verifyToken, verifyAdmin, getReviewHotels);
router.post("/geocode-preview", verifyToken, verifyProvider, previewHotelCoordinates);
router.patch("/:id/review", verifyToken, verifyAdmin, reviewHotel);
router.patch("/:id/featured", verifyToken, verifyAdmin, setHotelFeatured);
router.patch("/:id/geocode", verifyToken, verifyAdmin, refreshHotelCoordinates);
router.post("/:id/submit", verifyToken, verifyProvider, submitHotelForReview);
router.post("/:id/withdraw", verifyToken, verifyProvider, withdrawHotelReview);
router.get("/:id", optionalVerifyToken, getHotelById);
router.post("/", verifyToken, verifyProvider, createHotel);
router.put("/:id", verifyToken, verifyProvider, updateHotel);
router.delete("/:id", verifyToken, verifyProvider, deleteHotel);

export default router;
