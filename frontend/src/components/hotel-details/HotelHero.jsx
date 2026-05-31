import { motion } from "framer-motion";

const HotelHero = ({ hotel, mainPhoto, ratingValue }) => (
  <div className="relative h-[520px] overflow-hidden">

    <motion.img
      src={mainPhoto}
      className="w-full h-full object-cover"
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1 }}
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-8 left-6 right-6"
    >
      <div className="max-w-3xl bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">

        <p className="text-xs text-indigo-600 font-bold uppercase">
          Premium Hotel
        </p>

        <h1 className="text-3xl font-bold text-slate-900">
          {hotel.name}
        </h1>

        <div className="flex items-center gap-3 mt-3">
          <span className="bg-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
            {ratingValue.toFixed(1)} ★
          </span>

          <span className="text-slate-600">
            {hotel.city}
          </span>
        </div>

      </div>
    </motion.div>
  </div>
);

export default HotelHero;