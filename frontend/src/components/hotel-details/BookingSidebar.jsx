import React from "react";
import { Link } from "react-router-dom";

const BookingSidebar = ({ hotel }) => {

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(hotel.address)}&output=embed`;

  return (
    <aside className="space-y-6">
      {/* Thẻ đặt phòng */}
      <div className="sticky top-6 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl">
        <p className="text-sm uppercase tracking-[0.25em] text-indigo-500 font-medium">Book Now</p>
        <h3 className="mt-3 text-2xl font-bold text-slate-900">Ready for your stay?</h3>
        
        <div className="mt-8 space-y-4">
          <div className="rounded-3xl bg-slate-100 p-5 border border-slate-100">
            <p className="text-sm text-slate-500 font-medium">Price per night</p>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {hotel.price?.toLocaleString("vi-VN")}₫
            </p>
          </div>
          
          <Link 
          to={hotel.selectedRoomId ? `/room/${hotel.selectedRoomId}` : "#"} 
          className={`w-full inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-indigo-200 transition duration-300 hover:bg-indigo-700 active:scale-95 ${!hotel.selectedRoomId && "opacity-50 cursor-not-allowed grayscale"}`}
          onClick={(e) => !hotel.selectedRoomId && e.preventDefault()}
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
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{hotel.address}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">
          Location
        </h3>

        <p className="text-xs text-gray-500 mt-1 truncate">
          {hotel.address}
        </p>

        <div className="mt-1 h-52 w-full overflow-hidden rounded-[1.5rem]">
          <iframe
            title="Hotel Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={mapUrl}
            loading="lazy"
          ></iframe>
        </div>
      </div>
      </div>
    </aside>
  );
};

export default BookingSidebar;