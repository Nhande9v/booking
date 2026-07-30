import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN").format(price || 0);

const getPhoto = (photo) => {
  if (Array.isArray(photo) && photo.length) return photo[0];
  if (typeof photo === "string") return photo.split(",")[0];
  return "/hotel.jpg";
};

const DiscountSection = ({ hotels = [], loading = false }) => {
  const navigate = useNavigate();

  const discountedHotels = hotels
    .filter(
      (hotel) =>
        Number(hotel.oldPrice) > Number(hotel.price) &&
        Number(hotel.price) > 0
    )
    .slice(0, 4);

  if (loading || !discountedHotels.length) return null;

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 35 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="bg-gradient-to-b from-white to-slate-50 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-500">
              <Tag size={14} />
              Current offers
            </div>

            <h2 className="text-4xl font-extrabold text-slate-900 md:text-5xl">
              Save on your{" "}
              <span className="text-red-500">next stay</span>
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-slate-500">
              Explore properties currently available at a lower price.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/search")}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            View all properties

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {discountedHotels.map((hotel) => {
            const discountPercent = Math.round(
              ((hotel.oldPrice - hotel.price) / hotel.oldPrice) * 100
            );

            return (
              <motion.article
                key={hotel._id}
                variants={item}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/hotel/${hotel._id}`)}
                className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-md transition hover:shadow-xl"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={getPhoto(hotel.photo)}
                    alt={hotel.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  <Badge className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 font-bold text-white shadow-md">
                    Save {discountPercent}%
                  </Badge>
                </div>

                <div className="space-y-2 p-5">
                  <h3 className="line-clamp-1 text-lg font-semibold text-slate-900 transition group-hover:text-blue-600">
                    {hotel.name}
                  </h3>

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {hotel.city}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(hotel.price)}₫
                    </span>

                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(hotel.oldPrice)}₫
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">per night</p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default DiscountSection;