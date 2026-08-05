import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  ChevronLeft,
  Map,
  MapPin,
  MessageSquareText,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { removeAccents } from "@/lib/stringUtils";
import { getPropertyCoverUrl } from "@/lib/imageUtils";

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("vi-VN");

const HotelSidebar = ({
  hotels = [],
  name,
  loading,
  error,
  selectedHotel,
  setSelectedHotel,
  showHotelOnMap,
  onResultsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const propertyTypes = useMemo(
    () => [
      "All",
      ...Array.from(new Set(hotels.map((hotel) => hotel.type).filter(Boolean))),
    ],
    [hotels]
  );

  const filteredHotels = useMemo(() => {
    const keyword = removeAccents(searchTerm.trim());
    const results = hotels.filter((hotel) => {
      const matchesKeyword =
        !keyword ||
        removeAccents(hotel.name || "").includes(keyword) ||
        removeAccents(hotel.city || "").includes(keyword) ||
        removeAccents(hotel.address || "").includes(keyword);
      const matchesType =
        propertyType === "All" || hotel.type === propertyType;

      return matchesKeyword && matchesType;
    });

    return [...results].sort((first, second) => {
      if (sortBy === "price-low") {
        return Number(first.price || 0) - Number(second.price || 0);
      }
      if (sortBy === "price-high") {
        return Number(second.price || 0) - Number(first.price || 0);
      }
      if (sortBy === "rating") {
        return Number(second.rating || 0) - Number(first.rating || 0);
      }
      return Number(second.featured || 0) - Number(first.featured || 0);
    });
  }, [hotels, propertyType, searchTerm, sortBy]);

  useEffect(() => {
    onResultsChange(filteredHotels);
  }, [filteredHotels, onResultsChange]);

  const clearFilters = () => {
    setSearchTerm("");
    setPropertyType("All");
    setSortBy("recommended");
  };

  const hasFilters =
    Boolean(searchTerm) || propertyType !== "All" || sortBy !== "recommended";

  return (
    <div className="flex h-full w-full flex-col border-r border-slate-200 bg-white md:w-[460px]">
      <div className="border-b border-slate-200 bg-white px-5 pb-4 pt-5">
        <div className="flex items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 py-2.5 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              disabled={loading}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search name, street, or area"
              className="min-w-0 flex-1 border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
            {searchTerm && (
              <button type="button" title="Clear search" onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-slate-700">
                <X size={17} />
              </button>
            )}
          </label>

          <button
            type="button"
            title="Filters and sorting"
            onClick={() => setShowFilters((current) => !current)}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border transition ${
              showFilters || hasFilters
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase text-slate-500">Property type</p>
              {hasFilters && (
                <button type="button" onClick={clearFilters} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  Reset
                </button>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                    propertyType === type
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-blue-600">Stays in</p>
            <h1 className="mt-1 truncate text-xl font-black text-slate-950">{name}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {loading ? "Finding available properties..." : `${filteredHotels.length} ${filteredHotels.length === 1 ? "property" : "properties"}`}
            </p>
          </div>

          <label className="flex shrink-0 items-center gap-2 text-slate-500">
            <ArrowUpDown size={15} />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="max-w-36 bg-white text-xs font-bold text-slate-700 outline-none"
              aria-label="Sort properties"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Lowest price</option>
              <option value="price-high">Highest price</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>

        {selectedHotel && (
          <button type="button" onClick={() => setSelectedHotel(null)} className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
            <ChevronLeft size={15} />
            Back to all results
          </button>
        )}
      </div>

      <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4 pb-24 md:pb-4">
        {loading && [1, 2, 3].map((item) => (
          <div key={item} className="flex animate-pulse gap-3 rounded-lg border border-slate-200 p-3">
            <div className="h-28 w-32 shrink-0 rounded-lg bg-slate-200" />
            <div className="flex flex-1 flex-col justify-between py-1">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
              <div className="h-5 w-2/3 rounded bg-slate-200" />
            </div>
          </div>
        ))}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
            <p className="font-bold text-red-700">Unable to load properties</p>
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && filteredHotels.length === 0 && (
          <div className="px-6 py-14 text-center">
            <Search size={26} className="mx-auto text-slate-400" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">No matching properties</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Try a different name, area, or property type.</p>
            {hasFilters && <button type="button" onClick={clearFilters} className="mt-4 font-bold text-blue-600">Clear filters</button>}
          </div>
        )}

        {!loading && !error && filteredHotels.map((hotel) => {
          const isSelected = selectedHotel?._id === hotel._id;
          const hasRating = Number.isFinite(Number(hotel.rating));

          return (
            <motion.article
              key={hotel._id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedHotel(hotel)}
              className={`cursor-pointer overflow-hidden rounded-lg border bg-white transition ${
                isSelected ? "border-blue-500 shadow-md ring-2 ring-blue-100" : "border-slate-200 hover:border-blue-300 hover:shadow-sm"
              }`}
            >
              <div className="flex gap-3 p-3">
                <div className="relative h-28 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <img src={getPropertyCoverUrl(hotel)} alt={hotel.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-bold text-slate-800 shadow-sm">
                    <Star size={11} className={hasRating ? "fill-amber-400 text-amber-400" : "text-slate-400"} />
                    {hasRating ? Number(hotel.rating).toFixed(1) : "New"}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[11px] font-bold uppercase text-blue-600">{hotel.type || "Property"}</p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-black leading-5 text-slate-950">{hotel.name}</h3>
                  <p className="mt-1.5 flex items-start gap-1 text-xs text-slate-500">
                    <MapPin size={13} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{hotel.address || hotel.city}</span>
                  </p>
                  <div className="mt-auto pt-2 text-right">
                    <span className="text-base font-black text-blue-600">{formatPrice(hotel.price)}₫</span>
                    <span className="ml-1 text-[10px] text-slate-500">/ night</span>
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="border-t border-slate-200 bg-slate-50 px-3 py-3" onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MessageSquareText size={15} />
                    <span>
                      {hotel.reviewCount
                        ? `${hotel.reviewCount} guest ${hotel.reviewCount === 1 ? "review" : "reviews"}`
                        : "No guest reviews yet."}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => showHotelOnMap(hotel)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50">
                      <Map size={15} /> Show on map
                    </button>
                    <Link to={`/hotel/${hotel._id}`} className="flex flex-1 items-center justify-center rounded-lg bg-slate-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-600">
                      View details
                    </Link>
                  </div>
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};

export default HotelSidebar;
