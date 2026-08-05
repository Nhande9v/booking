import React, { useCallback, useEffect, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/axios";
import { getRoomCoverUrl } from "@/lib/imageUtils";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
  expired: "bg-red-50 text-red-700 ring-red-200",
};

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/bookings/mine", {
        params: { page, limit: 8 },
      });
      setBookings(response.data.items);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load your bookings.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = async (booking) => {
    const confirmed = window.confirm(
      `Cancel your booking at ${booking.hotelId?.name || "this property"}?`
    );
    if (!confirmed) return;

    try {
      setCancellingId(booking._id);
      await api.patch(`/bookings/${booking._id}/cancel`);
      toast.success("Booking cancelled.");
      await fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to cancel this booking.");
    } finally {
      setCancellingId(null);
    }
  };

  const payBooking = async (booking) => {
    try {
      setPayingId(booking._id);
      const response = await api.post("/payments/vnpay/checkout", {
        bookingId: booking._id,
        locale: "vn",
      });
      window.location.assign(response.data.paymentUrl);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start VNPay checkout.");
      setPayingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-5 border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-bold uppercase text-blue-600">Your stays</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">My bookings</h1>
            <p className="mt-2 text-sm text-slate-600">
              Review upcoming stays, booking totals, and reservation status.
            </p>
          </div>
          <button
            type="button"
            title="Refresh bookings"
            onClick={fetchBookings}
            className="grid h-11 w-11 place-items-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-44 animate-pulse rounded-lg border border-slate-200 bg-white" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <section className="flex min-h-72 flex-col items-center justify-center border border-dashed border-slate-300 bg-white px-6 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <BedDouble size={24} />
            </span>
            <h2 className="mt-4 text-xl font-black text-slate-900">No bookings yet</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Explore available properties and choose a room for your next stay.
            </p>
            <Link to="/search" className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">
              Find a property
            </Link>
          </section>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const canCancel =
                booking.status === "pending" && ["unpaid", "failed"].includes(booking.paymentStatus);
              const canPay =
                booking.status === "pending" && ["unpaid", "failed", "pending"].includes(booking.paymentStatus);

              return (
                <article
                  key={booking._id}
                  className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:grid-cols-[220px_1fr]"
                >
                  <img
                    src={getRoomCoverUrl(booking.roomId)}
                    alt={booking.roomId?.title || "Booked room"}
                    className="h-48 w-full object-cover md:h-full"
                  />
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-black text-slate-950">
                          {booking.hotelId?.name || "Property unavailable"}
                        </h2>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin size={15} />
                          {booking.hotelId?.city || "Location unavailable"}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${statusStyles[booking.status] || statusStyles.cancelled}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 border-y border-slate-100 py-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">Dates</p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <CalendarDays size={16} />
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">Room</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {booking.roomId?.title || "Room unavailable"} · {booking.roomQuantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">Total</p>
                        <p className="mt-1 text-lg font-black text-blue-600">
                          {Number(booking.totalPrice).toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Clock3 size={15} /> Payment: {booking.paymentStatus}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => cancelBooking(booking)}
                            disabled={cancellingId === booking._id}
                            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 px-4 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <XCircle size={17} />
                            {cancellingId === booking._id ? "Cancelling..." : "Cancel booking"}
                          </button>
                        )}
                        {canPay && (
                          <button
                            type="button"
                            onClick={() => payBooking(booking)}
                            disabled={payingId === booking._id}
                            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:bg-slate-300"
                          >
                            <CreditCard size={17} />
                            {payingId === booking._id
                              ? "Opening VNPay..."
                              : booking.paymentStatus === "pending"
                                ? "Continue payment"
                                : "Pay with VNPay"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <nav className="mt-6 flex items-center justify-center gap-3" aria-label="Booking pages">
            <button
              type="button"
              title="Previous page"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold text-slate-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              title="Next page"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        )}
      </div>
    </main>
  );
};

export default MyBookings;
