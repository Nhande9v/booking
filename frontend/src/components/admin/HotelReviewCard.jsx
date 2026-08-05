import React from "react";
import { Check, ExternalLink, MapPin, Star, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getPropertyCoverUrl } from "@/lib/imageUtils";

//Khách sạn có tọa hay chưa(isFinite: kiểm tra số có hợp lệ hay ko)
const hasCoordinates = (hotel) =>
  Number.isFinite(Number(hotel.lat)) && Number.isFinite(Number(hotel.lng));

const HotelReviewCard = ({
  hotel,
  status,
  reason,
  onReasonChange,
  onReview,
  onToggleFeatured,
  onRefreshCoordinates,
}) => (
  <article className="grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[220px_1fr]">
    <img src={getPropertyCoverUrl(hotel)} alt={hotel.name} className="aspect-[4/3] w-full rounded-lg object-cover" />
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">{hotel.name}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {hotel.type} · {hotel.city} · Host: {hotel.owner?.username || "Legacy data"}
          </p>
        </div>
        <Link to={`/hotel/${hotel._id}`} target="_blank" className="flex items-center gap-1 text-sm font-bold text-blue-600">
          View details <ExternalLink size={15} />
        </Link>
      </div>

      {status === "pending" ? (
        <>
          <textarea
            rows="2"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder="Rejection reason (required when rejecting)"
            className="mt-5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => onReview("approve")} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
              <Check size={17} /> Approve
            </button>
            <button type="button" onClick={() => onReview("reject")} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700">
              <X size={17} /> Reject
            </button>
          </div>
        </>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleFeatured}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
              hotel.featured
                ? "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                : "bg-slate-900 text-white hover:bg-blue-600"
            }`}
          >
            <Star size={17} fill={hotel.featured ? "currentColor" : "none"} />
            {hotel.featured ? "Remove from Featured" : "Add to Featured"}
          </button>
          <button type="button" onClick={onRefreshCoordinates} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100">
            <MapPin size={17} />
            {hasCoordinates(hotel) ? "Refresh map location" : "Add map location"}
          </button>
          {hasCoordinates(hotel) && (
            <span className="text-xs font-medium text-slate-500">
              {Number(hotel.lat).toFixed(5)}, {Number(hotel.lng).toFixed(5)}
            </span>
          )}
        </div>
      )}
    </div>
  </article>
);

export default HotelReviewCard;
