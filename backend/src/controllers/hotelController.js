import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { deleteStoredImage } from "../services/storage/cloudinaryStorage.js";
import { geocodeAddress } from "../services/geocodingService.js";

const editableFields = [
  "name",
  "type",
  "city",
  "district",
  "address",
  "price",
  "description",
  "languages",
  "amenities",
  "facilities",
  "policies",
  "coverPhoto",
  "photos",
];

const creatablePropertyTypes = ["Hotel", "HomeStay"];

const vietnameseSearchGroups = {
  a: "[aàáạảãâầấậẩẫăằắặẳẵ]",
  e: "[eèéẹẻẽêềếệểễ]",
  i: "[iìíịỉĩ]",
  o: "[oòóọỏõôồốộổỗơờớợởỡ]",
  u: "[uùúụủũưừứựửữ]",
  y: "[yỳýỵỷỹ]",
  d: "[dđ]",
};

const createSearchPattern = (value) => {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();

  const pattern = [...normalized]
    .map((character) =>
      vietnameseSearchGroups[character] ||
      character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    )
    .join("");

  return new RegExp(pattern, "i");
};

const pickFields = (source, fields) =>
  fields.reduce((result, field) => {
    if (source[field] !== undefined) result[field] = source[field];
    return result;
  }, {});

// nhận dữ liệu frontend gửi lên và kiểm tra tọa độ
const getSubmittedCoordinates = (source) => {
  if (source.lat === undefined || source.lng === undefined) return null;

  const lat = Number(source.lat);
  const lng = Number(source.lng);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null;
  }

  return { lat, lng };
};

const canManageHotel = (hotel, user) =>
  user.role === "admin" || hotel.owner.toString() === user.id;

const getHotelImages = (hotel, rooms = []) => [
  hotel.coverPhoto,
  ...(hotel.photos || []),
  ...rooms.flatMap((room) => [room.coverPhoto, ...(room.photos || [])]),
].filter(
  (image, index, images) =>
    image?.provider === "cloudinary" &&
    image.storageKey &&
    images.findIndex((item) => item?.storageKey === image.storageKey) === index
);

const updateCoordinates = async (hotel) => {
  let coordinates;
  try {
    coordinates = await geocodeAddress({
      address: hotel.address,
      district: hotel.district,
      city: hotel.city,
    });
  } catch (error) {
    console.error("Property geocoding failed:", error.message);
    return false;
  }

  if (!coordinates) return false;
  hotel.lat = coordinates.lat;
  hotel.lng = coordinates.lng;
  return true;
};

export const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Property not found." });
    }

    const isPublic = hotel.status === "active";
    const isOwner = Boolean(
      req.user?.id && hotel.owner && req.user.id === hotel.owner.toString()
    );
    const isAdmin = req.user?.role === "admin";

    if (!isPublic && !isOwner && !isAdmin) {
      return res.status(403).json({
        message: "This property is not publicly available.",
      });
    }

    if (hotel.owner) {
      await hotel.populate("owner", "username email");
    }
    return res.status(200).json(hotel);
  } catch (error) {
    return next(error);
  }
};

export const getHotels = async (req, res) => {
  try {
    const query = { status: "active" };
    if (req.query.type) query.type = req.query.type;
    if (req.query.featured !== undefined) {
      query.featured = req.query.featured === "true";
    }

    const hotels = await Hotel.find(query).sort({ createdAt: -1 });
    return res.status(200).json(hotels);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ owner: req.user.id }).sort({
      updatedAt: -1,
    });
    return res.status(200).json(hotels);
  } catch (error) {
    return next(error);
  }
};

export const createHotel = async (req, res, next) => {
  try {
    if (!creatablePropertyTypes.includes(req.body.type)) {
      return res.status(400).json({
        message: "Property type must be Hotel or HomeStay.",
      });
    }

    const hotelData = pickFields(req.body, editableFields);
    const hotel = new Hotel({
      ...hotelData,
      owner: req.user.id,
      status: "draft",
      featured: false,
      rejectionReason: "",
    });
    const submittedCoordinates = getSubmittedCoordinates(req.body);
    if (submittedCoordinates) {
      hotel.lat = submittedCoordinates.lat;
      hotel.lng = submittedCoordinates.lng;
    } else {
      await updateCoordinates(hotel);
    }
    await hotel.save();
    return res.status(201).json(hotel);
  } catch (error) {
    return next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Property not found." });
    if (!canManageHotel(hotel, req.user)) {
      return res.status(403).json({ message: "Bạn không có quyền sửa nơi lưu trú này" });
    }
    if (
      req.user.role !== "admin" &&
      !["draft", "rejected"].includes(hotel.status)
    ) {
      return res.status(409).json({
        message: "Properties can only be edited while in draft or rejected status.",
      });
    }

    if (
      req.body.type !== undefined &&
      !creatablePropertyTypes.includes(req.body.type)
    ) {
      return res.status(400).json({
        message: "Property type must be Hotel or HomeStay.",
      });
    }

    const addressChanged =
      (req.body.address !== undefined && req.body.address !== hotel.address) ||
      (req.body.district !== undefined && req.body.district !== hotel.district) ||
      (req.body.city !== undefined && req.body.city !== hotel.city);

    Object.assign(hotel, pickFields(req.body, editableFields));
    const submittedCoordinates = getSubmittedCoordinates(req.body);
    if (submittedCoordinates) {
      hotel.lat = submittedCoordinates.lat;
      hotel.lng = submittedCoordinates.lng;
    } else if (addressChanged) {
      hotel.lat = undefined;
      hotel.lng = undefined;
      await updateCoordinates(hotel);
    }
    if (hotel.status === "rejected") {
      hotel.status = "draft";
      hotel.rejectionReason = "";
    }
    await hotel.save();
    return res.status(200).json(hotel);
  } catch (error) {
    return next(error);
  }
};

//nút find on map
export const previewHotelCoordinates = async (req, res, next) => {
  try {
    const address = String(req.body.address || "").trim();
    const district = String(req.body.district || "").trim();
    const city = String(req.body.city || "").trim();
    if (!address || !city) {
      return res.status(400).json({ message: "City and full address are required." });
    }

    const coordinates = await geocodeAddress({ address, district, city });
    if (!coordinates) {
      return res.status(404).json({
        message: "The address could not be located. Add a street, ward, district, and city.",
      });
    }

    return res.status(200).json(coordinates);
  } catch (error) {
    return next(error);
  }
};

export const submitHotelForReview = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Property not found." });
    if (!canManageHotel(hotel, req.user)) {
      return res.status(403).json({ message: "You do not have permission to submit this property." });
    }
    if (!["draft", "rejected"].includes(hotel.status)) {
      return res.status(409).json({ message: "This property cannot be submitted in its current status." });
    }
    if (!hotel.coverPhoto?.url || !hotel.photos?.length) {
      return res.status(400).json({ message: "Add a cover photo and at least one gallery photo before submitting." });
    }

    const rooms = await Room.find({ hotelId: hotel._id });
    if (!rooms.length) {
      return res.status(400).json({ message: "Add at least one room type before submitting." });
    }

    const invalidRoom = rooms.find(
      (room) =>
        !room.coverPhoto?.url ||
        !room.photos?.length ||
        room.totalRooms < 1
    );
    if (invalidRoom) {
      return res.status(400).json({
        message: `Loại phòng ${invalidRoom.title} chưa có đủ ảnh hoặc số lượng phòng`,
      });
    }

    hotel.status = "pending";
    hotel.rejectionReason = "";
    await hotel.save();
    return res.status(200).json(hotel);
  } catch (error) {
    return next(error);
  }
};

export const withdrawHotelReview = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Property not found." });
    if (!canManageHotel(hotel, req.user)) {
      return res.status(403).json({ message: "Bạn không có quyền rút hồ sơ này" });
    }
    if (hotel.status !== "pending") {
      return res.status(409).json({ message: "Only pending properties can be withdrawn." });
    }

    hotel.status = "draft";
    await hotel.save();
    return res.status(200).json(hotel);
  } catch (error) {
    return next(error);
  }
};

export const getReviewHotels = async (req, res, next) => {
  try {
    const status = req.query.status || "pending";
    const allowedStatuses = ["pending", "active", "rejected", "draft"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái review không hợp lệ" });
    }

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      50
    );
    const search = req.query.search?.trim() || "";
    const query = { status };

    if (search) {
      const searchPattern = createSearchPattern(search);
      const matchingOwners = await User.find({
        $or: [
          { username: searchPattern },
          { email: searchPattern },
        ],
      }).select("_id");

      query.$or = [
        { name: searchPattern },
        { city: searchPattern },
        { type: searchPattern },
        { owner: { $in: matchingOwners.map((owner) => owner._id) } },
      ];
    }

    const sort = status === "pending" ? { createdAt: 1 } : { updatedAt: -1 };
    const [hotels, totalItems] = await Promise.all([
      Hotel.find(query)
      .populate("owner", "username email")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
      Hotel.countDocuments(query),
    ]);

    return res.status(200).json({
      items: hotels,
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

export const reviewHotel = async (req, res, next) => {
  try {
    const { action, reason = "" } = req.body;
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "action phải là approve hoặc reject" });
    }

    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Property not found." });
    if (hotel.status !== "pending") {
      return res.status(409).json({ message: "Only pending properties can be reviewed." });
    }
    if (action === "reject" && !reason.trim()) {
      return res.status(400).json({ message: "Enter a reason for rejection." });
    }

    if (action === "approve" && (!Number.isFinite(hotel.lat) || !Number.isFinite(hotel.lng))) {
      const geocoded = await updateCoordinates(hotel);
      if (!geocoded) {
        return res.status(400).json({
          message: "The property address could not be located. Ask the host to provide a more specific address.",
        });
      }
    }

    hotel.status = action === "approve" ? "active" : "rejected";
    hotel.rejectionReason = action === "reject" ? reason.trim() : "";
    await hotel.save();
    return res.status(200).json(hotel);
  } catch (error) {
    return next(error);
  }
};

//cái này là admin bật tắt featured
export const setHotelFeatured = async (req, res, next) => {
  try {
    if (typeof req.body.featured !== "boolean") {
      return res.status(400).json({ message: "featured must be a boolean." });
    }

    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Property not found." });
    if (hotel.status !== "active") {
      return res.status(409).json({ message: "Only active properties can be featured." });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotel._id,
      { $set: { featured: req.body.featured } },
      { new: true }
    );
    return res.status(200).json(updatedHotel);
  } catch (error) {
    return next(error);
  }
};

export const refreshHotelCoordinates = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Property not found." });

    const geocoded = await updateCoordinates(hotel);
    if (!geocoded) {
      return res.status(400).json({
        message: "The property address could not be located.",
      });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotel._id,
      { $set: { lat: hotel.lat, lng: hotel.lng } },
      { new: true }
    );
    return res.status(200).json(updatedHotel);
  } catch (error) {
    return next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Property not found." });
    if (!canManageHotel(hotel, req.user)) {
      return res.status(403).json({ message: "Bạn không có quyền xóa nơi lưu trú này" });
    }

    const rooms = await Room.find({ hotelId: hotel._id });
    const ownerId = hotel.owner.toString();
    const images = getHotelImages(hotel, rooms);
    await Promise.allSettled(
      images.map((image) => deleteStoredImage(image.storageKey, ownerId))
    );
    await Room.deleteMany({ hotelId: hotel._id });
    await hotel.deleteOne();
    return res.status(200).json({ message: "Property deleted successfully." });
  } catch (error) {
    return next(error);
  }
};
