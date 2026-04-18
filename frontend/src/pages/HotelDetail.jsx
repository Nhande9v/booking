import Features from "@/components/Features";
import BookingSidebar from "@/components/hotel-details/BookingSidebar";
import HotelGallery from "@/components/hotel-details/HotelGallery";
import HotelHero from "@/components/hotel-details/HotelHero";
import HotelInfo from "@/components/hotel-details/HotelInfo";
import RoomList from "@/components/rooms/RoomList";
import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";

const Hoteldetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchHotel();
    fetchRooms();
  }, [id]);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/rooms/hotel/${id}`);
      const data = await res.json();
      setRooms(data);
      if (data && data.length > 0) {
            setSelectedRoom(data[0]);
        }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phòng: ", error);
    }
  }
  const fetchHotel = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/hotels/${id}`);
      const data = await res.json();
      setHotel(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu khách sạn: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-semibold text-slate-700 dark:text-slate-200">
        Đang tải dữ liệu khách sạn...
      </div>
    );

  if (!hotel)
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        Không tìm thấy khách sạn này!
      </div>
    );

  const displayPhotos = hotel.photo?.length > 0
    ? hotel.photo
    : [
        "https://images.unsplash.com/photo-1570214476695-19bd467e6f7a?q=80&w=2070",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070",
      ];

const photos = hotel.photo?.length > 0 ? hotel.photo : ["https://images.unsplash.com/photo-1570214476695-19bd467e6f7a"];
  return (
    <div className="mx-auto max-w-7xl px-8 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200">
        <HotelHero hotel={hotel} mainPhoto={photos[0]} ratingValue={hotel.rating || 4.5} />

        <div className="grid gap-6 px-4 py-8 sm:grid-cols-[1.7fr_0.95fr] sm:px-10">
          <div className="space-y-6">
            <HotelGallery photos={photos.slice(1, 4)} />
            <RoomList
            rooms = {rooms}
            selectedRoom={selectedRoom}
            onSelectRoom={(room) => setSelectedRoom(room)}
            />
            <HotelInfo hotel={hotel} />
          </div>
          <BookingSidebar 
          hotel={{
            ...hotel,
            price : selectedRoom ? selectedRoom.price : hotel.price,
            selectedRoomId: selectedRoom?._id 
          }} />
        </div>
      </div>
      <div className="pt-8 px-4 sm:px-10">
        <Features />
      </div>
    </div>
  );
};

export default Hoteldetail;
