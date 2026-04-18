import Hotel from '../models/Hotel.js';

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json("Không tìm thấy khách sạn");
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getHotels = async (req, res) => {
    try {
        const date = await Hotel.find();
        res.status(200).json(date);
    } catch (error) {
        console.log("Lỗi khi gọi hệ thống: ", error);
        res.status(500).json({ message: error.message });
    }
};

export const createHotel = async (req, res) => {
    try {
        const hotel = new Hotel(req.body); 
        const newHotel = await hotel.save(); // Model sẽ tự điền lat/lng
        res.status(201).json(newHotel);
    } catch (error) {
        console.log("Lỗi khi gọi Creatask: ", error);
        res.status(500).json({ message: error.message });
    }
}

export const updateHotel = async (req, res) => {
    try {
        const { name, address, city, price, rating, description, photo, featured } = req.body;
        const { lat, lng } = await getCoords(address, city);
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { name, address, city, price, rating, description, photo, featured, lat, lng },
            { new: true }
        );
        if(!updatedHotel) {
            return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
        }

        res.status(200).json(updatedHotel);
    } catch (error) {
        console.log("Lỗi khi gọi UpdateHotel: ", error);
        res.status(500).json({ message: error.message });
    }
}

export const deleteHotel = async (req, res) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!deletedHotel) {
        return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }
    res.status(200).json(deletedHotel);
  } catch (error) {
    console.log("Lỗi khi gọi DeleteHotel: ", error);
    res.status(500).json({ message: error.message });
  }
};
