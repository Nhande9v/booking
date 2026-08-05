import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getRoomCoverUrl } from "@/lib/imageUtils";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN").format(price || 0);

const DiscountSection = ({ rooms = [], loading = false }) => {
  const navigate = useNavigate();

  const discountedRooms = rooms
    .filter(
      (room) =>
        room.hotelId &&
        Number(room.oldPrice) > Number(room.price) &&
        Number(room.price) > 0
    )
    .slice(0, 4);

  if (loading || !discountedRooms.length) return null;

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
              Explore room offers currently available at a lower nightly rate.
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
          {discountedRooms.map((room) => {
            const discountPercent = Math.round(
              ((room.oldPrice - room.price) / room.oldPrice) * 100
            );

            return (
              <motion.article
                key={room._id}
                variants={item}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/room/${room._id}`)}
                className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-md transition hover:shadow-xl"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={getRoomCoverUrl(room)}
                    alt={room.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  <Badge className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 font-bold text-white shadow-md">
                    Save {discountPercent}%
                  </Badge>
                </div>

                <div className="space-y-2 p-5">
                  <h3 className="line-clamp-1 text-lg font-semibold text-slate-900 transition group-hover:text-blue-600">
                    {room.title}
                  </h3>

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {room.hotelId.name} · {room.hotelId.city}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(room.price)}₫
                    </span>

                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(room.oldPrice)}₫
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
