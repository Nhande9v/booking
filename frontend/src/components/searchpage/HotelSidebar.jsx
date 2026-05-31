import React from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ChevronLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";

const HotelSidebar = ({ hotels, name, selectedHotel, setSelectedHotel }) => {
  const displayHotels = selectedHotel ? [selectedHotel] : hotels;

  return (
    <div className="h-full bg-white/95 backdrop-blur-md shadow-2xl flex flex-col w-[400px] border-r border-slate-200">
      {/* SEARCH HEADER */}
      <div className="p-5 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2.5 rounded-2xl mb-4 border border-slate-200">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            defaultValue={name}
            className="bg-transparent border-none outline-none text-sm font-medium w-full"
            placeholder="Search destination..."
          />
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-none">{name}</h2>
            <p className="text-[13px] text-slate-500 mt-1.5 font-medium">
              {hotels.length} places to stay found
            </p>
          </div>
          {selectedHotel && (
            <button
              onClick={() => setSelectedHotel(null)}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
            >
              <ChevronLeft size={14} /> View all
            </button>
          )}
        </div>
      </div>

      {/* HOTEL LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {displayHotels.map((hotel) => (
          <motion.div
            key={hotel._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedHotel(hotel)}
            className={`group flex gap-4 p-3 rounded-2xl cursor-pointer transition-all border ${
              selectedHotel?._id === hotel._id
                ? "bg-blue-50 border-blue-200 shadow-md"
                : "bg-white border-transparent hover:border-slate-200 hover:shadow-sm"
            }`}
          >
            {/* THUMBNAIL */}
            <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 relative">
              <img
                src={hotel.photo?.[0] || "/hotel.jpg"}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                alt={hotel.name}
              />
              <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-black">
                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                {hotel.rating || "New"}
              </div>
            </div>

            {/* INFO */}
            <div className="flex flex-col justify-between py-1 flex-1">
              <div>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600">
                  {hotel.name}
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin size={10} /> {hotel.city}
                </p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Price</span>
                  <p className="text-blue-600 font-black text-sm">
                    {Number(hotel.price).toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <Link
                  to={`/hotel/${hotel._id}`}
                  className="text-[11px] font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition"
                >
                  Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HotelSidebar;