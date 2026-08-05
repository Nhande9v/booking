import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { deleteStoredImage } from "../services/storage/cloudinaryStorage.js";

const editableFields = [
  "title",
  "price",
  "oldPrice",
  "maxPeople",
  "totalRooms",
  "desc",
  "coverPhoto",
  "photos",
];

const pickFields = (source) =>
  editableFields.reduce((result, field) => {
    if (source[field] !== undefined) result[field] = source[field];
    return result;
  }, {});

const canManage = (hotel, user) =>
  user.role === "admin" || hotel.owner.toString() === user.id;

const canViewHotel = (hotel, user) =>
  hotel.status === "active" ||
  user?.role === "admin" ||
  Boolean(hotel.owner && user?.id && hotel.owner.toString() === user.id);

const ensureEditableHotel = (hotel, user) => {
  if (!canManage(hotel, user)) {
    const error = new Error("Bạn không có quyền quản lý phòng của nơi lưu trú này");
    error.status = 403;
    throw error;
  }
  if (user.role !== "admin" && !["draft", "rejected"].includes(hotel.status)) {
    const error = new Error("Rooms can only be edited while the property is in draft or rejected status.");
    error.status = 409;
    throw error;
  }
};

const uniqueCloudinaryImages = (room) =>
  [room.coverPhoto, ...(room.photos || [])].filter(
    (image, index, images) =>
      image?.provider === "cloudinary" &&
      image.storageKey &&
      images.findIndex((item) => item?.storageKey === image.storageKey) === index
  );

const applyDiscount = (room) => {
  if (room.oldPrice === null || room.oldPrice === undefined || room.oldPrice === "") {
    room.oldPrice = null;
    room.isDiscounted = false;
    return;
  }

  if (Number(room.oldPrice) <= Number(room.price)) {
    const error = new Error("Regular price must be greater than the discounted price.");
    error.status = 400;
    throw error;
  }

  room.isDiscounted = true;
};

export const getDiscountedRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ isDiscounted: true })
      .populate({
        path: "hotelId",
        match: { status: "active" },
        select: "name city coverPhoto photos status",
      })
      .sort({ updatedAt: -1 })
      .limit(12);

    return res.status(200).json(rooms.filter((room) => room.hotelId));
  } catch (error) {
    return next(error);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Property not found." });
    }

    if (!canViewHotel(hotel, req.user)) {
      return res.status(403).json({
        message: "These rooms are not publicly available.",
      });
    }

    const rooms = await Room.find({ hotelId: hotel._id }).sort({
      createdAt: 1,
    });

    return res.status(200).json(rooms);
  } catch (error) {
    return next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room type not found." });
    }

    const hotel = await Hotel.findById(room.hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Property not found." });
    }

    if (!canViewHotel(hotel, req.user)) {
      return res.status(403).json({
        message: "This room is not publicly available.",
      });
    }

    return res.status(200).json(room);
  } catch (error) {
    return next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.body.hotelId);
    if (!hotel) return res.status(404).json({ message: "Property not found." });
    ensureEditableHotel(hotel, req.user);

    const room = new Room({
      ...pickFields(req.body),
      hotelId: hotel._id,
    });
    applyDiscount(room);
    await room.save();
    return res.status(201).json(room);
  } catch (error) {
    return next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room type not found." });
    const hotel = await Hotel.findById(room.hotelId);
    if (!hotel) return res.status(404).json({ message: "Property not found." });
    ensureEditableHotel(hotel, req.user);

    Object.assign(room, pickFields(req.body));
    applyDiscount(room);
    await room.save();
    if (hotel.status === "rejected") {
      hotel.status = "draft";
      hotel.rejectionReason = "";
      await hotel.save();
    }
    return res.status(200).json(room);
  } catch (error) {
    return next(error);
  }
};

export const updateRoomPricing = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room type not found." });

    const hotel = await Hotel.findById(room.hotelId);
    if (!hotel) return res.status(404).json({ message: "Property not found." });
    if (!canManage(hotel, req.user)) {
      return res.status(403).json({ message: "You cannot manage pricing for this room." });
    }
    if (hotel.status === "pending") {
      return res.status(409).json({ message: "Pricing cannot change while the property is under review." });
    }

    if (req.body.price === undefined) {
      return res.status(400).json({ message: "price is required." });
    }

    room.price = req.body.price;
    room.oldPrice = req.body.oldPrice ?? null;
    applyDiscount(room);
    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    return next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room type not found." });
    const hotel = await Hotel.findById(room.hotelId);
    if (!hotel) return res.status(404).json({ message: "Property not found." });
    ensureEditableHotel(hotel, req.user);

    const ownerId = hotel.owner.toString();
    await Promise.allSettled(
      uniqueCloudinaryImages(room).map((image) =>
        deleteStoredImage(image.storageKey, ownerId)
      )
    );
    await room.deleteOne();
    return res.status(200).json({ message: "Room type deleted successfully." });
  } catch (error) {
    return next(error);
  }
};
