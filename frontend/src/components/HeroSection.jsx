import React from "react";
import { useState } from "react";
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import { useNavigate } from "react-router";

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
            {/* content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
                <h1 className=" text-4xl md:text-5xl font-bold text-white mb-2">
                    Escape to the <span className="italic">Extraordinary</span>
                </h1>
                <p className="text-white text-sm md:text-base mb-8 max-w-2xl text-center">
                    Find your perfect stay at the best prices. Book now and experience unforgettable moments!
                </p>
                {/* Search Bar */}
                <div className="flex gap-2 w-full max-w-2xl">
                    <Input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-12 rounded-xl text-base px-6 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60"
                    />
                    <Button 
                    onClick={handleSearch}
                     variant="gradient" size="xl" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6">
                        Search
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;


