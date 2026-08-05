import Features from "@/components/home/Features";
import BookingSidebar from "@/components/hotel-details/BookingSidebar";
import HotelGallery from "@/components/hotel-details/HotelGallery";
import HotelHero from "@/components/hotel-details/HotelHero";
import HotelInfo from "@/components/hotel-details/HotelInfo";
import HotelReviews from "@/components/hotel-details/HotelReviews";
import ImageLightbox from "@/components/hotel-details/ImageLightbox";
import RoomList from "@/components/rooms/RoomList";
import React, { useCallback, useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import api from "@/lib/axios";
import {
  getPropertyCoverUrl,
  getPropertyGalleryUrls,
} from "@/lib/imageUtils";

const Hoteldetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await api.get(`/rooms/hotel/${id}`);
      const data = await res.data;
      setRooms(data);
      if (data && data.length > 0) {
            setSelectedRoom(data[0]);
        }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phòng: ", error);
    }
  }, [id]);

  const fetchHotel = useCallback(async () => {
    try {
      const res = await api.get(`/hotels/${id}`);
      const data = await res.data;
      setHotel(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu khách sạn: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHotel();
    fetchRooms();
  }, [fetchHotel, fetchRooms]);

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

  const coverUrl = getPropertyCoverUrl(hotel);
  const galleryUrls = getPropertyGalleryUrls(hotel);
  const allPhotoUrls = [coverUrl, ...galleryUrls].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-8 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200">
        <HotelHero
          hotel={hotel}
          mainPhoto={coverUrl}
          ratingValue={hotel.rating}
          onPhotoClick={() => setLightboxIndex(0)}
        />

        <div className="grid gap-6 px-4 py-8 sm:grid-cols-[1.7fr_0.95fr] sm:px-10">
          <div className="space-y-6">
            <HotelGallery
              photos={galleryUrls.slice(0, 4)}
              onPhotoClick={(index) => setLightboxIndex(index + 1)}
            />
            <RoomList
            rooms = {rooms}
            selectedRoom={selectedRoom}
            onSelectRoom={(room) => setSelectedRoom(room)}
            />
            <HotelInfo hotel={hotel} />
            <HotelReviews
              hotel={hotel}
              onSummaryChange={(summary) =>
                setHotel((current) => ({ ...current, ...summary }))
              }
            />
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
      {lightboxIndex !== null && (
        <ImageLightbox
          images={allPhotoUrls}
          currentIndex={lightboxIndex}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

export default Hoteldetail;
