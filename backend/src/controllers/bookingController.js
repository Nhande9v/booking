import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { createError } from "../utils/error.js";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const BOOKING_HOLD_IN_MS = 15 * 60 * 1000;// giữ phòng cho khách
const BOOKING_TIME_ZONE = process.env.BOOKING_TIME_ZONE || "Asia/Ho_Chi_Minh";
const SAME_DAY_BOOKING_CUTOFF =
  process.env.SAME_DAY_BOOKING_CUTOFF || "22:00";

const parseDateOnly = (value, fieldName) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) {
    throw createError(400, `${fieldName} must use the YYYY-MM-DD format.`);
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const monthIndex = Number(monthText) - 1;
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, monthIndex, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== monthIndex ||
    date.getUTCDate() !== day
  ) {
    throw createError(400, `${fieldName} is not a valid calendar date.`);
  }

  return date;
};

const parseBookingDates = (checkInValue, checkOutValue) => {
  const checkIn = parseDateOnly(checkInValue, "Check-in");
  const checkOut = parseDateOnly(checkOutValue, "Check-out");

  if (checkOut <= checkIn) {
    throw createError(400, "Check-out must be after check-in.");
  }

  const nights = Math.round((checkOut - checkIn) / DAY_IN_MS);
  return { checkIn, checkOut, nights };
};

const getClockInTimeZone = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );

  return {
    dateKey: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
};

const parseCutoffMinutes = (value) => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  const hours = Number(match?.[1]);
  const minutes = Number(match?.[2]);

  if (!match || hours > 23 || minutes > 59) {
    throw createError(500, "SAME_DAY_BOOKING_CUTOFF must use HH:mm format.");
  }

  return hours * 60 + minutes;
};

const validateBookingWindow = (checkInValue, now = new Date()) => {
  const checkInDateKey = String(checkInValue);
  const currentClock = getClockInTimeZone(now, BOOKING_TIME_ZONE);

  if (checkInDateKey < currentClock.dateKey) {
    throw createError(400, "Check-in cannot be in the past.");
  }

  if (
    checkInDateKey === currentClock.dateKey &&
    currentClock.minutes >= parseCutoffMinutes(SAME_DAY_BOOKING_CUTOFF)
  ) {
    throw createError(
      409,
      `Same-day bookings close at ${SAME_DAY_BOOKING_CUTOFF} (${BOOKING_TIME_ZONE}).`
    );
  }
};

//Trong khoảng ngày khách muốn đặt, đã có bao nhiêu phòng của room type đó đang bị giữ hoặc đã được xác nhận
const getReservedRoomQuantity = async ({ roomId, checkIn, checkOut, now }) => {
  const [summary] = await Booking.aggregate([
    {
      $match: {
        roomId,
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
        $or: [
          { status: "confirmed" },
          {
            status: "pending",
            expiresAt: { $gt: now },
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        reserved: { $sum: "$roomQuantity" },
      },
    },
  ]);

  return summary?.reserved || 0;
};

const findBookingWithDetails = (bookingId) =>
  Booking.findById(bookingId)
    .populate("hotelId", "name city address coverPhoto owner status")
    .populate("roomId", "title coverPhoto price maxPeople totalRooms");

const canViewBooking = (booking, user) => {
  if (user.role === "admin") return true;
  if (user.role === "user") {
    return booking.userId.toString() === user.id;
  }

  const hotelOwner = booking.hotelId?.owner;
  return user.role === "provider" && hotelOwner?.toString() === user.id;
};

export const createBooking = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      throw createError(403, "Only guest accounts can create bookings.");
    }

    const { roomId } = req.body;
    if (!mongoose.isValidObjectId(roomId)) {
      throw createError(400, "Room ID is invalid.");
    }

    const { checkIn, checkOut, nights } = parseBookingDates(
      req.body.checkIn,
      req.body.checkOut
    );
    validateBookingWindow(req.body.checkIn);
    const guests = Number(req.body.guests);
    const roomQuantity = Number(req.body.roomQuantity ?? 1);

    if (!Number.isInteger(guests) || guests < 1) {
      throw createError(400, "Guest count is invalid.");
    }

    if (!Number.isInteger(roomQuantity) || roomQuantity < 1) {
      throw createError(400, "Room quantity is invalid.");
    }

    const room = await Room.findById(roomId);
    if (!room) {
      throw createError(404, "Room type not found.");
    }

    const hotel = await Hotel.findById(room.hotelId).select("status owner bookingEnabled");
    if (!hotel || hotel.status !== "active") {
      throw createError(409, "This property is not available for booking.");
    }

    if (hotel.bookingEnabled === false || room.bookingEnabled === false) {
      throw createError(409, "This room is not currently accepting bookings.");
    }

    if (hotel.owner.toString() === req.user.id) {
      throw createError(403, "You cannot book your own property.");
    }

    if (guests > room.maxPeople * roomQuantity) {
      throw createError(
        400,
        "Guest count exceeds the selected room capacity."
      );
    }

    const now = new Date();
    const reserved = await getReservedRoomQuantity({
      roomId: room._id,
      checkIn,
      checkOut,
      now,
    });
    const available = Math.max(room.totalRooms - reserved, 0);

    if (roomQuantity > available) {
      throw createError(
        409,
        "Not enough rooms are available for the selected dates."
      );
    }

    const pricePerNight = Number(room.price);
    if (!Number.isFinite(pricePerNight) || pricePerNight < 0) {
      throw createError(409, "This room does not have a valid price.");
    }

    const booking = await Booking.create({
      userId: req.user.id,
      hotelId: hotel._id,
      roomId: room._id,
      checkIn,
      checkOut,
      guests,
      roomQuantity,
      nights,
      pricePerNight,
      totalPrice: pricePerNight * nights * roomQuantity,
      status: "pending",
      paymentStatus: "unpaid",
      expiresAt: new Date(now.getTime() + BOOKING_HOLD_IN_MS),
    });

    return res.status(201).json(booking);
  } catch (error) {
    return next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      throw createError(403, "Only guest accounts have a personal booking list.");
    }

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      50
    );
    const query = { userId: req.user.id };

    const [items, totalItems] = await Promise.all([
      Booking.find(query)
        .populate("hotelId", "name city address coverPhoto status")
        .populate("roomId", "title coverPhoto")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Booking.countDocuments(query),
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

export const getHostBookings = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.query.hotelId)) {
      throw createError(400, "A valid hotelId is required.");
    }

    const hotel = await Hotel.findById(req.query.hotelId).select("owner name");
    if (!hotel) throw createError(404, "Property not found.");
    if (req.user.role !== "admin" && hotel.owner.toString() !== req.user.id) {
      throw createError(403, "You cannot view bookings for this property.");
    }

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 50);
    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled", "expired"];
    const query = { hotelId: hotel._id };

    if (req.query.status && req.query.status !== "all") {
      if (!allowedStatuses.includes(req.query.status)) {
        throw createError(400, "Booking status filter is invalid.");
      }
      query.status = req.query.status;
    }

    const [items, totalItems] = await Promise.all([
      Booking.find(query)
        .populate("userId", "username email")
        .populate("roomId", "title coverPhoto")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Booking.countDocuments(query),
    ]);

    return res.status(200).json({
      hotel,
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

export const getBookingById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw createError(400, "Booking ID is invalid.");
    }

    const booking = await findBookingWithDetails(req.params.id);
    if (!booking) {
      throw createError(404, "Booking not found.");
    }

    if (!canViewBooking(booking, req.user)) {
      throw createError(403, "You cannot view this booking.");
    }

    return res.status(200).json(booking);
  } catch (error) {
    return next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      throw createError(403, "Only the guest can cancel this booking.");
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      throw createError(400, "Booking ID is invalid.");
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      throw createError(404, "Booking not found.");
    }

    if (booking.userId.toString() !== req.user.id) {
      throw createError(403, "You can only cancel your own booking.");
    }

    if (booking.status !== "pending") {
      throw createError(409, "Only pending bookings can be cancelled online.");
    }

    if (!["unpaid", "failed"].includes(booking.paymentStatus)) {
      throw createError(
        409,
        "A booking with payment activity requires the refund workflow."
      );
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.expiresAt = null;
    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    return next(error);
  }
};
