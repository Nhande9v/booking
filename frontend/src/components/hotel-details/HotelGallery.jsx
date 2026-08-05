import React from "react";
import { motion } from "framer-motion";

const HotelGallery = ({ photos, onPhotoClick }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {photos.map((photo, index) => (
        <motion.button
          type="button"
          key={index}
          onClick={() => onPhotoClick(index)}
          whileHover={{ y: -5 }}
          className="group cursor-zoom-in overflow-hidden rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          aria-label={`Open property photo ${index + 2}`}
        >
          <motion.img
            src={photo}
            alt={`Property gallery ${index + 1}`}
            className="h-52 w-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default HotelGallery;
