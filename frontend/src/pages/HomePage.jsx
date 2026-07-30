import React, { useEffect, useState } from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturedHotels from "../components/home/FeaturedHotels";
import DiscountSection from "../components/home/DiscountSection";
import Features from "@/components/home/Features";
import HomeExtra from "@/components/home/HomeExtra";
import BookingSteps from "../components/home/BookingSteps";
import HomeCallToAction from "../components/home/HomeCallToAction";
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
            <BookingSteps />
            <FeaturedHotels hotels={hotelBuffer} />
            <DiscountSection hotels={hotelBuffer}/>
            <HomeExtra />
            <Features />
            <HomeCallToAction />
        </div>
    )
}

export default Homepage;
