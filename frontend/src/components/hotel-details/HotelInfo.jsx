import React from "react";
import { Wifi, Car, Coffee, Tv, Wind, Utensils, Dumbbell, Waves, ShieldCheck } from "lucide-react";

const HotelInfo = ({ hotel }) => {
  const amenityMap = {
    wifi: { label: "Free Wi-Fi", icon: <Wifi size={20} /> },
    parking: { label: "Parking", icon: <Car size={20} /> },
    pool: { label: "Swimming Pool", icon: <Waves size={20} /> },
    breakfast: { label: "Breakfast Included", icon: <Coffee size={20} /> },
    tv: { label: "TV", icon: <Tv size={20} /> },
    ac: { label: "Air Conditioning", icon: <Wind size={20} /> },
    restaurant: { label: "Restaurant", icon: <Utensils size={20} /> },
    gym: { label: "Fitness Center", icon: <Dumbbell size={20} /> },
  };

  return (
    <section className="rounded-[2rem] bg-white p-8 shadow-lg border border-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-600 font-bold">Information</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Complete your experience</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600 border border-emerald-100">
          <ShieldCheck size={16} /> Secure payment
        </div>
      </div>
      
      <p className="mt-6 text-lg leading-8 text-slate-600">
        {hotel.description || "Khách sạn sang trọng với tiện nghi hiện đại và phong cách nội thất tinh tế."}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-6 border border-slate-100 transition hover:border-indigo-200">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Address</p>
          <p className="mt-3 text-base font-semibold text-slate-800">{hotel.address}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-6 border border-slate-100 transition hover:border-indigo-200">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">City</p>
          <p className="mt-3 text-base font-semibold text-slate-800">{hotel.city}</p>
        </div>  
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <div className="h-6 w-1 bg-indigo-600 rounded-full" /> Amenities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {hotel.amenities?.map((item) => {
            const amenity = amenityMap[item.toLowerCase()];
            return (
              <div
                key={item} 
                className="group flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 transition-all duration-300 hover:border-indigo-500 hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  {amenity?.icon || <Wifi size={20} />}
                </div>
                <span className="text-sm font-bold text-slate-700">{amenity?.label || item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HotelInfo;