import React, { useEffect, useState } from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturedHotels from "../components/home/FeaturedHotels";
import DiscountSection from "../components/home/DiscountSection";
import Features from "@/components/home/Features";
import HomeExtra from "@/components/home/HomeExtra";
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
            <DiscountSection hotels={hotelBuffer}/>
            <HomeExtra />
            <Features />
        </div>
    )
}

export default Homepage;
