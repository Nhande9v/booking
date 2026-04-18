import Room from "../models/Room.js";

export const getHotelRooms = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const rooms = await Room.find({ hotelId: hotelId });
        return res.status(200).json(rooms || []);
        if(!rooms) {
            return res.status(404).json({ message: "Không tìm thấy phòng nào cho khách sạn này" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu phòng" });
    }
}

export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if(!room) return res.status(404).json({ message: "Không tìm thấy phòng này" });
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu phòng" });
    }
}