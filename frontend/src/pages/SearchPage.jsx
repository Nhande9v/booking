import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { removeAccents } from "@/lib/stringUtils";
import api from "../lib/axios";
import MapComponent from "@/components/home/MapComponent";
import HotelSidebar from "@/components/searchpage/HotelSidebar"; 
import { MapPin } from "lucide-react"; 

const SearchPage = () => {
    const location = useLocation();
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const { lat, lng, name } = location.state || { lat: 16.0544, lng: 108.2022, name: "Đà Nẵng" };

    useEffect(() => {
        fetchHotels();
    }, [lat, lng, name]);

    const fetchHotels = async () => {
        try {
            const res = await api.get(`/hotels`);
            const filteredHotels = res.data.filter(hotel => {
                if (!name || name.trim() === "") return true;
                const hotelCity = removeAccents(hotel.city);
                const searchName = removeAccents(name);
                return hotelCity.includes(searchName) || searchName.includes(hotelCity);
            });
            setHotels(filteredHotels);
        } catch (error) {
            console.error("Error fetching hotels: ", error);
        }
    };

    return (
        <div className="flex w-full h-[calc(100vh-70px)] bg-white overflow-hidden">
            {/* SIDEBAR */}
            <aside className="relative z-20 flex-shrink-0">
                <HotelSidebar 
                    hotels={hotels} 
                    name={name} 
                    selectedHotel={selectedHotel} 
                    setSelectedHotel={setSelectedHotel} 
                />
            </aside>

            {/* MAP */}
            <main className="relative flex-1 z-10">
                <MapComponent 
                    center={[lat, lng]} 
                    hotels={hotels} 
                    selectedHotel={selectedHotel} 
                    onMarkerClick={setSelectedHotel} 
                />
                
                {/* Nút định vị nổi */}
                <div className="absolute top-4 right-4 z-20">
                    <button className="p-3 bg-white shadow-xl rounded-full hover:bg-slate-50 transition border border-slate-200">
                         <MapPin size={22} className="text-blue-600" />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default SearchPage;