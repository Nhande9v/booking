import { motion } from "framer-motion";

const HotelHero = ({ hotel, mainPhoto, ratingValue, onPhotoClick }) => (
  <div className="relative h-[520px] overflow-hidden">
    <button
      type="button"
      onClick={onPhotoClick}
      className="h-full w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white"
      aria-label="Open property photos"
    >
      <motion.img
        src={mainPhoto}
        alt={`${hotel.name} cover`}
        className="h-full w-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      />
    </button>

    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="pointer-events-none absolute bottom-8 left-6 right-6"
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
            {ratingValue !== null &&
            ratingValue !== undefined &&
            Number.isFinite(Number(ratingValue))
              ? `${Number(ratingValue).toFixed(1)} ★`
              : "New"}
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
