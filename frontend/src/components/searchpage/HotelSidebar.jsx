import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  ChevronLeft,
  Search,
  Map,
  X,
} from "lucide-react";
import { removeAccents } from "@/lib/stringUtils";

const HotelSidebar = ({
  hotels = [],
  name,
  loading,
  error,
  selectedHotel,
  setSelectedHotel,
  showHotelOnMap,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHotels = useMemo(() => {
    const keyword = removeAccents(searchTerm.trim());

    if (!keyword) return hotels;

    return hotels.filter((hotel) => {
      const hotelName = removeAccents(hotel.name || "");
      const hotelCity = removeAccents(hotel.city || "");

      return (
        hotelName.includes(keyword) ||
        hotelCity.includes(keyword)
      );
    });
  }, [hotels, searchTerm]);

  const displayHotels = selectedHotel
    ? [selectedHotel]
    : filteredHotels;

  return (
    <div className="flex h-full w-full flex-col border-r border-slate-200 bg-white/95 shadow-xl backdrop-blur-md md:w-[400px]">
      {/* HEADER */}
      <div className="border-b border-slate-100 bg-white p-5">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-300 focus-within:bg-white">
          <Search size={18} className="shrink-0 text-slate-400" />

          <input
            type="text"
            value={searchTerm}
            disabled={loading}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by name or city..."
            className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="text-slate-400 transition hover:text-slate-700"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Search results
            </p>

            <h1 className="mt-2 truncate text-2xl font-bold text-slate-900">
              {name}
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {loading
                ? "Finding available properties..."
                : `${filteredHotels.length} ${
                    filteredHotels.length === 1
                      ? "property"
                      : "properties"
                  } found`}
            </p>
          </div>

          {selectedHotel && (
            <button
              type="button"
              onClick={() => setSelectedHotel(null)}
              className="flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
            >
              <ChevronLeft size={14} />
              View all
            </button>
          )}
        </div>
      </div>

      {/* HOTEL LIST */}
      <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
        {loading &&
          [1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex animate-pulse gap-4 rounded-2xl border border-slate-100 p-3"
            >
              <div className="h-32 w-32 shrink-0 rounded-xl bg-slate-200" />

              <div className="flex flex-1 flex-col justify-between py-2">
                <div>
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
                </div>

                <div className="h-5 w-2/3 rounded bg-slate-200" />
              </div>
            </div>
          ))}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
            <p className="font-bold text-red-600">
              Unable to load properties
            </p>

            <p className="mt-2 text-sm leading-6 text-red-500">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && displayHotels.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Search size={24} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No properties found
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Try another property name or clear the current filter.
            </p>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-5 font-bold text-blue-600 hover:text-blue-700"
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {!loading &&
          !error &&
          displayHotels.map((hotel) => (
            <motion.article
              key={hotel._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedHotel(hotel)}
              className={`group cursor-pointer rounded-2xl border p-3 transition ${
                selectedHotel?._id === hotel._id
                  ? "border-blue-200 bg-blue-50 shadow-md"
                  : "border-transparent bg-white hover:border-slate-200 hover:shadow-sm"
              }`}
            >
              <div className="flex gap-4">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={hotel.photo?.[0] || "/hotel.jpg"}
                    alt={hotel.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold backdrop-blur">
                    <Star
                      size={10}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {hotel.rating || "New"}
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div>
                    <h3 className="line-clamp-2 text-sm font-bold text-slate-900 transition group-hover:text-blue-600">
                      {hotel.name}
                    </h3>

                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} />
                      {hotel.city}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      From
                    </p>

                    <p className="mt-1 font-black text-blue-600">
                      {Number(hotel.price || 0).toLocaleString("vi-VN")}₫
                      <span className="ml-1 text-[10px] font-medium text-slate-400">
                        / night
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showHotelOnMap(hotel);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                >
                  <Map size={14} />
                  Show on map
                </button>

                <Link
                  to={`/hotel/${hotel._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-600"
                >
                  View details
                </Link>
              </div>
            </motion.article>
          ))}
      </div>
    </div>
  );
};

export default HotelSidebar;