import MapComponent from "@/components/MapComponent";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { removeAccents } from "@/lib/stringUtils";
import { Link } from "react-router-dom";
import api from "../lib/axios";
import { ChevronLeft, MapPin, Star } from "lucide-react";
const SearchPage = () => {
    const location = useLocation();
    const [hotels,setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const {lat,lng,name} = location.state || {lat: 16.0544, lng: 108.2022, name: "Đà Nẵng"};

    useEffect(()=>{
        fetchHotels();
    },[lat,lng])

    const fetchHotels = async () => {
        try {
            const res = await api.get(`/hotels`);
            const filteredHotels = res.data.filter(hotel=>{
                 if (!name || name.trim() === "") return false; 

            const hotelCity = removeAccents(hotel.city);
            const searchName = removeAccents(name);

            return hotelCity.includes(searchName) || searchName.includes(hotelCity);
            })
            setHotels(filteredHotels)
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu khách sạn: ", error);
        }
    }

    const displayHotels = selectedHotel ? [selectedHotel] : hotels;
    return(
        // relative để làm mốc cho lớp con
        <div className="relative w-full h-[calc(100vh-70px)] overflow-hidden">
            <div className="absolute inset-0 z-0">
                <MapComponent center={[lat,lng]} hotels={hotels} onMarkerClick={setSelectedHotel}/>
            </div>
            <div className="absolute top-5 left-5 bottom-5 z-10 w-full max-w-[380px] pointer-events-none">
                <div className="w-full h-full bg-white/85 backdrop-blur-sm shadow-2xl rounded-2xl border border-slate-200 flex flex-col pointer-events-auto overflow-hidden">
                    {/* thẻ đầu */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                            <MapPin size={14} className="fill-blue-600/10" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Available Now</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {name}
                        </h2>
                        <p className="text-sm text-slate-400 font-medium">{hotels.length} luxury stays found</p>
                        
                        {selectedHotel && (
                            <button 
                                onClick={() => setSelectedHotel(null)}
                                className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <ChevronLeft size={14} /> Clear selection
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {displayHotels.map(hotel => (
                        <div key={hotel._id} onClick={()=> setSelectedHotel(hotel)} 
                        className={`group p-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                                    selectedHotel?._id === hotel._id 
                                    ? "border-blue-500 bg-blue-50/30 shadow-md" 
                                    : "border-transparent bg-white hover:border-slate-200 hover:shadow-sm"
                                }`}>
                            <div className="relative overflow-hidden rounded-xl mb-3">
                                    <img 
                                        src={hotel.photo?.[0] || "/hotel.jpg"} 
                                        className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110" 
                                        alt={hotel.name}
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-bold text-slate-900">{hotel.rating}</span>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition">
                                        {hotel.name}
                                    </h3>
                                </div>
                            <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 font-medium">Starting from</span>
                                    <p className="text-sm font-black text-blue-600">
                                        VND {Number(hotel.price).toLocaleString('vi-VN')}
                                        <span className="text-xs font-normal text-slate-400">/night</span>
                                    </p>
                                </div>
                                {/* nhảy sang trang details */}
                                <Link 
                                to={`/hotel/${hotel._id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all"
                                >
                                View Details
                                </Link>
                            </div>  
                        </div>
                    ))}
                </div>
                </div>
                
            </div>
        </div>
    )
}

export default SearchPage;