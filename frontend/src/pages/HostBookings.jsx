import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Mail, RefreshCw, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/axios";
import { getRoomCoverUrl } from "@/lib/imageUtils";

const statuses = ["all", "pending", "confirmed", "completed", "cancelled", "expired"];
const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-600",
  expired: "bg-red-50 text-red-700",
};
const formatDate = (value) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));

const HostBookings = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/bookings/host", { params: { hotelId, status, page, limit: 10 } });
      setHotel(response.data.hotel);
      setBookings(response.data.items);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load property bookings.");
    } finally {
      setLoading(false);
    }
  }, [hotelId, page, status]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const changeStatus = (nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Link to={`/host/hotels/${hotelId}/rooms`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600">
          <ArrowLeft size={18} /> Room management
        </Link>
        <header className="mt-5 flex flex-wrap items-end justify-between gap-5 border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-bold uppercase text-blue-600">Host bookings</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{hotel?.name || "Property bookings"}</h1>
            <p className="mt-2 text-sm text-slate-500">Review reservations and payment status for this property.</p>
          </div>
          <button type="button" title="Refresh bookings" onClick={fetchBookings} className="grid h-11 w-11 place-items-center rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        <div className="my-5 flex flex-wrap gap-2">
          {statuses.map((item) => (
            <button key={item} type="button" onClick={() => changeStatus(item)} className={`rounded-lg px-4 py-2 text-sm font-bold capitalize ${status === item ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-600"}`}>
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-lg border border-slate-200 bg-white" />)}</div>
        ) : bookings.length === 0 ? (
          <div className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-sm font-semibold text-slate-500">No bookings match this status.</div>
        ) : (
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {bookings.map((booking) => (
              <article key={booking._id} className="grid gap-4 border-b border-slate-100 p-4 last:border-0 md:grid-cols-[140px_1fr_auto] md:items-center">
                <img src={getRoomCoverUrl(booking.roomId)} alt={booking.roomId?.title || "Booked room"} className="aspect-[4/3] w-full rounded-lg object-cover" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-black text-slate-900">{booking.roomId?.title || "Room unavailable"}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusStyles[booking.status] || statusStyles.cancelled}`}>{booking.status}</span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><Users size={16} /> {booking.userId?.username || "Guest"} · {booking.guests} guests · {booking.roomQuantity} rooms</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><Mail size={16} /> {booking.userId?.email || "Email unavailable"}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={16} /> {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-xs font-bold uppercase text-slate-400">Total</p>
                  <p className="mt-1 text-lg font-black text-blue-600">{Number(booking.totalPrice).toLocaleString("vi-VN")}₫</p>
                  <p className="mt-1 text-xs font-semibold capitalize text-slate-500">Payment: {booking.paymentStatus}</p>
                </div>
              </article>
            ))}
          </section>
        )}

        {!loading && pagination.totalPages > 1 && (
          <nav className="mt-6 flex items-center justify-center gap-3">
            <button type="button" title="Previous page" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white disabled:opacity-40"><ChevronLeft size={18} /></button>
            <span className="text-sm font-bold text-slate-600">Page {pagination.page} of {pagination.totalPages}</span>
            <button type="button" title="Next page" disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white disabled:opacity-40"><ChevronRight size={18} /></button>
          </nav>
        )}
      </div>
    </main>
  );
};

export default HostBookings;
