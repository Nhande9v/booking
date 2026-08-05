import React from "react";
import { BadgeDollarSign, Eye, Pencil, Power, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/lib/imageUtils";

const RoomCard = ({ room, editable, canManagePricing, canManageAvailability, onEdit, onDelete, onPricing, onToggleAvailability }) => (
  <article className="grid gap-4 border-b border-slate-200 p-4 last:border-b-0 sm:grid-cols-[150px_1fr_auto] sm:items-center">
    <img src={getImageUrl(room.coverPhoto) || getImageUrl(room.photos?.[0]) || "/hotel.jpg"} alt={room.title} className="aspect-[4/3] w-full rounded-lg object-cover" />
    <div>
      <h2 className="font-black text-slate-900">{room.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{room.totalRooms || 1} rooms · up to {room.maxPeople} guests</p>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        <p className="font-bold text-blue-600">{Number(room.price).toLocaleString("vi-VN")}₫ / night</p>
        {room.isDiscounted && Number(room.oldPrice) > Number(room.price) && (
          <span className="text-sm text-slate-400 line-through">{Number(room.oldPrice).toLocaleString("vi-VN")}₫</span>
        )}
      </div>
      <p className={`mt-2 text-xs font-bold ${room.bookingEnabled !== false ? "text-emerald-700" : "text-slate-500"}`}>
        {room.bookingEnabled !== false ? "Accepting bookings" : "Bookings paused"}
      </p>
    </div>
    <div className="flex gap-2">
      <Link to={`/room/${room._id}`} title="View room details" className="rounded-lg border border-blue-200 p-2.5 text-blue-600 hover:bg-blue-50">
        <Eye size={18} />
      </Link>
      {canManagePricing && (
        <button type="button" title="Manage room pricing" onClick={onPricing} className="rounded-lg border border-emerald-200 p-2.5 text-emerald-700 hover:bg-emerald-50">
          <BadgeDollarSign size={18} />
        </button>
      )}
      {canManageAvailability && (
        <button
          type="button"
          title={room.bookingEnabled !== false ? "Pause room bookings" : "Resume room bookings"}
          onClick={onToggleAvailability}
          className={`rounded-lg border p-2.5 ${room.bookingEnabled !== false ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50" : "border-slate-300 text-slate-500 hover:bg-slate-100"}`}
        >
          <Power size={18} />
        </button>
      )}
      {editable && (
        <>
          <button type="button" title="Edit room type" onClick={onEdit} className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100">
            <Pencil size={18} />
          </button>
          <button type="button" title="Delete room type" onClick={onDelete} className="rounded-lg border border-red-200 p-2.5 text-red-600 hover:bg-red-50">
            <Trash2 size={18} />
          </button>
        </>
      )}
    </div>
  </article>
);

export default RoomCard;
