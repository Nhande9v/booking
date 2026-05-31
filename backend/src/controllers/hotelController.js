import Hotel from '../models/Hotel.js';

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('owner', 'username email');
    if (!hotel) return res.status(404).json("Không tìm thấy khách sạn");
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getHotels = async (req, res) => {
    try {
        const {type, status, featured} = req.query;
        const query = {};
        if (type) query.type = type;
        if (status) query.status = status;
        if (featured) query.featured = featured;
        const hotels = await Hotel.find(query).sort({ createdAt: -1 });
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createHotel = async (req, res) => {
    try {
        const newhotel = new Hotel({
            ...req.body,
            owner: req.user._id,
            status: 'pending' // đợi admin
        }) 
        const savedHotel = await newhotel.save(); // Model sẽ tự điền lat/lng
        res.status(201).json(savedHotel);
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
            { $set: req.body },
            { new: true, runValidators: true }
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
