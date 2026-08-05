import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";
import Review from "../models/Review.js";

const validateReviewInput = ({ rating, comment }) => {
  const numericRating = Number(rating);
  const cleanComment = String(comment || "").trim();

  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return { error: "Rating must be an integer from 1 to 5." };
  }
  if (cleanComment.length < 10 || cleanComment.length > 1000) {
    return { error: "Review text must be between 10 and 1000 characters." };
  }

  return { rating: numericRating, comment: cleanComment };
};

const refreshHotelRating = async (hotelId) => {
  const [summary] = await Review.aggregate([
    {
      $match: {
        hotelId: new mongoose.Types.ObjectId(hotelId),
        status: "published",
      },
    },
    { $group: { _id: "$hotelId", rating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
  ]);

  const update = summary
    ? { $set: { rating: Number(summary.rating.toFixed(1)), reviewCount: summary.reviewCount } }
    : { $set: { reviewCount: 0 }, $unset: { rating: "" } };

  return Hotel.findByIdAndUpdate(hotelId, update, { new: true }).select("rating reviewCount");
};

export const getHotelReviews = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 5, 1), 20);
    const query = { hotelId: req.params.hotelId, status: "published" };
    const [items, totalItems] = await Promise.all([
      Review.find(query)
        .populate("userId", "username")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Review.countDocuments(query),
    ]);

    return res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.max(Math.ceil(totalItems / limit), 1),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getMyHotelReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      hotelId: req.params.hotelId,
      userId: req.user.id,
    });
    return res.status(200).json(review);
  } catch (error) {
    return next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only guest accounts can write reviews." });
    }

    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ message: "Property not found." });
    if (hotel.status !== "active") {
      return res.status(409).json({ message: "Only published properties can be reviewed." });
    }
    if (hotel.owner?.toString() === req.user.id) {
      return res.status(403).json({ message: "You cannot review your own property." });
    }

    const input = validateReviewInput(req.body);
    if (input.error) return res.status(400).json({ message: input.error });

    const review = await Review.create({
      hotelId: hotel._id,
      userId: req.user.id,
      rating: input.rating,
      comment: input.comment,
    });
    await review.populate("userId", "username");
    const summary = await refreshHotelRating(hotel._id);
    return res.status(201).json({ review, summary });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "You have already reviewed this property." });
    }
    return next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found." });
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own review." });
    }

    const input = validateReviewInput(req.body);
    if (input.error) return res.status(400).json({ message: input.error });
    review.rating = input.rating;
    review.comment = input.comment;
    await review.save();
    await review.populate("userId", "username");
    const summary = await refreshHotelRating(review.hotelId);
    return res.status(200).json({ review, summary });
  } catch (error) {
    return next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found." });
    const ownsReview = review.userId.toString() === req.user.id;
    if (!ownsReview && req.user.role !== "admin") {
      return res.status(403).json({ message: "You cannot delete this review." });
    }

    const hotelId = review.hotelId;
    await review.deleteOne();
    const summary = await refreshHotelRating(hotelId);
    return res.status(200).json({ message: "Review deleted.", summary });
  } catch (error) {
    return next(error);
  }
};
