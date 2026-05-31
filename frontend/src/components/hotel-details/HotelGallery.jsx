import React from "react";
import { motion } from "framer-motion";

const HotelGallery = ({ photos }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {photos.map((photo, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -5 }}
          className="overflow-hidden rounded-2xl shadow-md group"
        >
          <motion.img
            src={photo}
            alt=""
            className="h-52 w-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default HotelGallery;