import React from "react";

const HotelGallery = ({ photos }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {photos.map((photo, index) => (
        <div 
          key={index} 
          className="overflow-hidden rounded-[1.75rem] bg-white/5 shadow-lg ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <img 
            src={photo} 
            alt={`Ảnh khách sạn ${index + 2}`} 
            className="h-52 w-full object-cover" 
          />
        </div>
      ))}
    </div>
  );
};

export default HotelGallery;