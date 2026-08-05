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
    const [discountedRooms, setDiscountedRooms] = useState([]);

    const fetchHotels = async () => {
        try {
            const [hotelsResponse, offersResponse] = await Promise.all([
                api.get("/hotels"),
                api.get("/rooms/discounted"),
            ]);
            setHotelBuffer(hotelsResponse.data);
            setDiscountedRooms(offersResponse.data);
        
        } catch (error) {
            console.error("Lỗi xảy ra khi truy xuất hotels:", error);
        }
    } 

    useEffect(()=>{
        fetchHotels();
    },[])

    return(
        <div>
            <HeroSection />
            <BookingSteps />
            <FeaturedHotels hotels={hotelBuffer} />
            <DiscountSection rooms={discountedRooms}/>
            <HomeExtra />
            <Features />
            <HomeCallToAction />
        </div>
    )
}

export default Homepage;
