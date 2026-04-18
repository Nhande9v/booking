import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import FeaturedHotels from "../components/FeaturedHotels";
import Features from "@/components/Features";
import HomeExtra from "@/components/HomeExtra";
import api from "../lib/axios";

const Homepage = () => {
    const [hotelBuffer, setHotelBuffer] =useState([]); 
    
    useEffect(()=>{
        fetchHotels();
    },[])

    const fetchHotels = async () => {
        try {
            const res = await api.get("/hotels");
            setHotelBuffer(res.data);
            console.log(res.data);
        
        } catch (error) {
            console.error("Lỗi xảy ra khi truy xuất hotels:", error);
        }
    } 

    return(
        <div>
            <HeroSection />
            <FeaturedHotels hotels={hotelBuffer} />
            <HomeExtra />
            <Features />
        </div>
    )
}

export default Homepage;
