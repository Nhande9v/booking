import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Users, Wifi, Wind } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";
import api from "../lib/axios";
import { getRoomCoverUrl, getRoomGalleryUrls } from "@/lib/imageUtils";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomQuantity: 1,
  });

  const today = useMemo(() => formatLocalDate(new Date()), []);

  const estimatedNights = useMemo(() => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const checkIn = new Date(`${bookingForm.checkIn}T00:00:00Z`);
    const checkOut = new Date(`${bookingForm.checkOut}T00:00:00Z`);
    return Math.max(Math.round((checkOut - checkIn) / 86400000), 0);
  }, [bookingForm.checkIn, bookingForm.checkOut]);

  const estimatedTotal =
    Number(room?.price || 0) *
    estimatedNights *
    Number(bookingForm.roomQuantity || 0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${roomId}`);
        setRoom(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const updateBookingForm = (event) => {
    const { name, value } = event.target;
    setBookingForm((current) => {
      if (name === "roomQuantity") {
        const roomQuantity = Math.min(
          Math.max(Number(value) || 1, 1),
          room.totalRooms
        );
        const maximumGuests = room.maxPeople * roomQuantity;

        return {
          ...current,
          roomQuantity,
          guests: Math.min(Number(current.guests) || 1, maximumGuests),
        };
      }

      if (name === "guests") {
        const maximumGuests =
          room.maxPeople * Number(current.roomQuantity || 1);
        return {
          ...current,
          guests: Math.min(Math.max(Number(value) || 1, 1), maximumGuests),
        };
      }

      return { ...current, [name]: value };
    });
  };

  const submitBooking = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please sign in before reserving a room.");
      navigate("/login");
      return;
    }

    const role = user?.details?.role || user?.role;
    if (role !== "user") {
      toast.error("Please use a guest account to reserve a room.");
      return;
    }

    if (!bookingForm.checkIn || !bookingForm.checkOut || estimatedNights < 1) {
      toast.error("Choose a valid check-in and check-out date.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/bookings", {
        roomId: room._id,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guests: Number(bookingForm.guests),
        roomQuantity: Number(bookingForm.roomQuantity),
      });
      toast.success("Your room is being held for 15 minutes.");
      navigate("/bookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create this booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500 font-medium">Loading room details...</div>;
  if (!room) return <div className="text-center py-20 text-red-500 font-bold">Room not found!</div>;

  const coverUrl = getRoomCoverUrl(room);
  const galleryUrls = getRoomGalleryUrls(room);
  const acceptingBookings =
    room.bookingEnabled !== false && room.propertyBookingEnabled !== false;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. NÚT BACK VÀ HEADER ẢNH */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img 
          src={coverUrl} 
          className="h-full w-full object-cover transition duration-700 hover:scale-105" 
          alt={room.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-bold text-slate-700 shadow-lg backdrop-blur-md hover:bg-white transition active:scale-95"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-6 -mt-20 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600"> Premium Room</span>
              <h1 className="text-4xl font-black text-slate-900 mt-2 mb-6">{room.title}</h1>
              
              <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Users size={20} className="text-indigo-500" /> {room.maxPeople} guests
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Wifi size={20} className="text-indigo-500" /> Free Wi-Fi
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Wind size={20} className="text-indigo-500" /> Air Conditioning
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
              <p className="text-lg leading-relaxed text-slate-600">
                {room.desc || "A perfect getaway with modern amenities, offering a relaxing and comfortable stay."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {galleryUrls.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  className="h-64 w-full object-cover rounded-3xl border border-slate-200 shadow-sm" 
                  alt="room sub"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="sticky top-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Price per night</p>
                <h2 className="text-4xl font-black text-indigo-600 mt-2">
                  {room.price?.toLocaleString("vi-VN")}₫
                </h2>
                {room.isDiscounted && Number(room.oldPrice) > Number(room.price) && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      {Number(room.oldPrice).toLocaleString("vi-VN")}₫
                    </span>
                    <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                      Save {Math.round(((room.oldPrice - room.price) / room.oldPrice) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {!acceptingBookings && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                  This room is not currently accepting bookings.
                </div>
              )}
              <form className="space-y-4" onSubmit={submitBooking}>
                <fieldset disabled={!acceptingBookings || submitting} className="space-y-4 disabled:opacity-60">
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1.5 text-sm font-bold text-slate-700">
                    Check-in
                    <input
                      type="date"
                      name="checkIn"
                      min={today}
                      value={bookingForm.checkIn}
                      onChange={updateBookingForm}
                      required
                      className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <label className="space-y-1.5 text-sm font-bold text-slate-700">
                    Check-out
                    <input
                      type="date"
                      name="checkOut"
                      min={bookingForm.checkIn || today}
                      value={bookingForm.checkOut}
                      onChange={updateBookingForm}
                      required
                      className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1.5 text-sm font-bold text-slate-700">
                    Guests
                    <span className="ml-1 text-xs font-medium text-slate-400">
                      (max {room.maxPeople * Number(bookingForm.roomQuantity || 1)})
                    </span>
                    <input
                      type="number"
                      name="guests"
                      min="1"
                      max={room.maxPeople * Number(bookingForm.roomQuantity || 1)}
                      value={bookingForm.guests}
                      onChange={updateBookingForm}
                      required
                      className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <label className="space-y-1.5 text-sm font-bold text-slate-700">
                    Rooms
                    <span className="ml-1 text-xs font-medium text-slate-400">
                      (max {room.totalRooms})
                    </span>
                    <input
                      type="number"
                      name="roomQuantity"
                      min="1"
                      max={room.totalRooms}
                      value={bookingForm.roomQuantity}
                      onChange={updateBookingForm}
                      required
                      className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between border-y border-slate-100 py-4">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <CalendarDays size={17} />
                    {estimatedNights || 0} {estimatedNights === 1 ? "night" : "nights"}
                  </span>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400">Estimated total</p>
                    <p className="text-xl font-black text-slate-900">
                      {estimatedTotal.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!acceptingBookings || submitting}
                  className="min-h-12 w-full rounded-lg bg-blue-600 px-5 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {submitting ? "Reserving..." : "Reserve room"}
                </button>
                <p className="text-center text-xs leading-5 text-slate-500">
                  Your room is held for 15 minutes. The final price is confirmed by the server.
                </p>
                </fieldset>
              </form>

              <hr className="my-8 border-slate-100" />
              
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500 leading-6 italic">
                  * Check-in: 2:00 PM - Check-out: 12:00 PM <br />
                  * Free cancellation up to 24 hours before arrival
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomPage;
