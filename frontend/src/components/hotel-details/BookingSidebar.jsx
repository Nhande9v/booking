import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, LoaderCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";
import api from "@/lib/axios";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const BookingSidebar = ({ hotel }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomQuantity: 1,
  });

  const selectedRoom = hotel.selectedRoom;
  const today = useMemo(() => formatLocalDate(new Date()), []);
  const roomQuantity = Number(bookingForm.roomQuantity || 1);
  const maxRooms = selectedRoom?.totalRooms || 1;
  const maxGuests = selectedRoom ? selectedRoom.maxPeople * roomQuantity : 1;
  const acceptingBookings =
    Boolean(selectedRoom) &&
    hotel.bookingEnabled !== false &&
    selectedRoom.bookingEnabled !== false;

  const estimatedNights = useMemo(() => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const checkIn = new Date(`${bookingForm.checkIn}T00:00:00Z`);
    const checkOut = new Date(`${bookingForm.checkOut}T00:00:00Z`);
    return Math.max(Math.round((checkOut - checkIn) / 86400000), 0);
  }, [bookingForm.checkIn, bookingForm.checkOut]);

  const estimatedTotal = Number(hotel.price || 0) * estimatedNights * roomQuantity;
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(hotel.address)}&output=embed`;

  const updateBookingForm = (event) => {
    const { name, value } = event.target;
    setBookingForm((current) => {
      if (name === "roomQuantity") {
        const nextQuantity = Math.min(Math.max(Number(value) || 1, 1), maxRooms);
        const nextMaxGuests = (selectedRoom?.maxPeople || 1) * nextQuantity;
        return {
          ...current,
          roomQuantity: nextQuantity,
          guests: Math.min(Number(current.guests) || 1, nextMaxGuests),
        };
      }

      if (name === "guests") {
        return {
          ...current,
          guests: Math.min(Math.max(Number(value) || 1, 1), maxGuests),
        };
      }

      return { ...current, [name]: value };
    });
  };

  const submitBooking = async (event) => {
    event.preventDefault();

    if (!selectedRoom) {
      toast.error("Please select a room first.");
      return;
    }

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
        roomId: selectedRoom._id,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guests: Number(bookingForm.guests),
        roomQuantity,
      });
      toast.success("Your room is being held for 15 minutes.");
      navigate("/bookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create this booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="space-y-6">
      <div className="sticky top-6 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-indigo-500">Book Now</p>
        <h3 className="mt-3 text-2xl font-bold text-slate-900">Ready for your stay?</h3>

        <div className="mt-8 space-y-4">
          <div className="rounded-3xl border border-slate-100 bg-slate-100 p-5">
            <p className="text-sm font-medium text-slate-500">Price per night</p>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {hotel.price?.toLocaleString("vi-VN")}₫
            </p>
            {selectedRoom && (
              <p className="mt-2 text-sm font-semibold text-slate-600">{selectedRoom.title}</p>
            )}
          </div>

          {!selectedRoom && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              Select a room below before booking.
            </div>
          )}

          {selectedRoom && !acceptingBookings && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
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
                    className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                    className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1.5 text-sm font-bold text-slate-700">
                  Guests
                  <input
                    type="number"
                    name="guests"
                    min="1"
                    max={maxGuests}
                    value={bookingForm.guests}
                    onChange={updateBookingForm}
                    required
                    className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
                <label className="space-y-1.5 text-sm font-bold text-slate-700">
                  Rooms
                  <input
                    type="number"
                    name="roomQuantity"
                    min="1"
                    max={maxRooms}
                    value={bookingForm.roomQuantity}
                    onChange={updateBookingForm}
                    required
                    className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <CalendarDays size={16} />
                  {estimatedNights} {estimatedNights === 1 ? "night" : "nights"}
                </span>
                <span className="text-lg font-black text-slate-900">
                  {estimatedTotal.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <button
                type="submit"
                disabled={!acceptingBookings || submitting}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 text-base font-bold text-white shadow-lg shadow-indigo-200 transition duration-300 hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {submitting ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Reserving
                  </>
                ) : (
                  <>
                    <Users size={18} />
                    Reserve room
                  </>
                )}
              </button>
            </fieldset>
          </form>

          <Link
            to={hotel.selectedRoomId ? `/room/${hotel.selectedRoomId}` : "#"}
            className={`inline-flex w-full items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 ${!hotel.selectedRoomId && "cursor-not-allowed opacity-50 grayscale"}`}
            onClick={(event) => !hotel.selectedRoomId && event.preventDefault()}
          >
            {hotel.selectedRoomId ? "View Room Details" : "Select a Room First"}
          </Link>

          <Link to="/search" className="inline-flex w-full items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
            Back to Search
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-2 shadow-lg">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Hotel location</h3>
          <p className="mt-1 line-clamp-1 text-xs text-slate-500">{hotel.address}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900">Location</h3>
          <p className="mt-1 truncate text-xs text-gray-500">{hotel.address}</p>

          <div className="mt-1 h-52 w-full overflow-hidden rounded-[1.5rem]">
            <iframe
              title="Hotel Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={mapUrl}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BookingSidebar;
