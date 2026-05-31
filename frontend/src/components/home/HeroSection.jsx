import React from "react";
import { useState } from "react";
import {Button} from "@/components/ui/button";
import { useNavigate } from "react-router";
import { MapPin } from "lucide-react";

const HeroSection =()=>{
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = async() => {
        if(!searchQuery.trim()) return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
            {
                headers: {
                    
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();

            if(data.length > 0){
                const {lat, lon, display_name} = data[0];
                navigate('/search', {state: {lat : parseFloat(lat), lng: parseFloat(lon), name: display_name}});
            }
        } catch (error) {
            console.log("Lỗi khi tìm kiếm địa điểm: ", error);
        }
    }

    return(
        <div className="relative w-full h-[550px] overflow-hidden bg-slate-700 ">
            {/* Background Image */}
            <div 
            className="absolute inset-0 opacity-40"
            style={{
                backgroundImage: "url('/hotel.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
            /> 
            <div className="absolute inset-0 bg-black/40" /> {/* Overlay tối hơn để nổi bật chữ */}
            {/* content */}
           <div className="relative z-10 w-full max-w-5xl px-6  mx-auto flex flex-col items-center justify-center h-full gap-8">
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tighter">
                        Escape to the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 italic font-serif">
                            Extraordinary
                        </span>
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Find sanctuaries curated for your comfort. Your journey to excellence starts here.
                    </p>
                </div>

                {/* Search Bar Hiện Đại - Dạng Floating Bar */}
                <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-white/20 backdrop-blur-sm bg-white/95">
                    <div className="flex-1 w-full flex items-center px-6 gap-3 border-r border-slate-100">
                        <MapPin className="text-blue-600" size={20} />
                        <input
                            type="text"
                            placeholder="Where are you going?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 bg-transparent border-none text-slate-800 placeholder:text-slate-400 text-lg 
                                    focus:ring-0 focus:outline-none shadow-none" 
                        />
                    </div>
                    
                    {/* Có thể thêm chọn ngày/người ở đây để tăng tính chuyên nghiệp */}
                    <div className="hidden md:flex px-6 border-r border-slate-100 text-slate-400 gap-3">
                         <span className="text-sm font-medium">Add dates</span>
                    </div>

                    <Button 
                        onClick={handleSearch}
                        className="w-full md:w-auto h-14 px-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
                    >
                        Search
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;


