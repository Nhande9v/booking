import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN").format(price || 0);

const getDisplayPhoto = (photo) => {
  if (Array.isArray(photo) && photo.length) return photo[0];
  if (typeof photo === "string") return photo.split(",")[0];
  return "/hotel.jpg";
};

const FeaturedHotels = ({ hotels = [], loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="bg-[#fcfcfd] px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-8">
          <div className="h-[600px] w-full animate-pulse rounded-[2rem] bg-slate-200 lg:w-[calc(68%-1rem)]" />

          <div className="flex w-full flex-col gap-8 lg:w-[calc(32%-1rem)]">
            <div className="h-[284px] animate-pulse rounded-[1.5rem] bg-slate-200" />
            <div className="h-[284px] animate-pulse rounded-[1.5rem] bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (!hotels.length) return null;

  const mainHotel = hotels[0];
  const sideHotels = hotels.slice(1, 3);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="bg-[#fcfcfd] px-6 py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14">
          <span className="mb-6 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
            Featured Properties
          </span>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="text-5xl font-black leading-none tracking-tighter text-slate-900 md:text-7xl">
              Stays made for <br />
              <span className="text-blue-600">
                your next journey.
              </span>
            </h2>

            <Button
              variant="link"
              onClick={() => navigate("/search")}
              className="group h-auto p-0 text-lg font-bold text-blue-600 hover:no-underline"
            >
              Explore all properties

              <span className="ml-2 inline-block transition-transform group-hover:translate-x-2">
                →
              </span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-stretch gap-8">
          {/* MAIN HOTEL */}
          <div className="flex w-full lg:w-[calc(68%-1rem)]">
            <Card
              onClick={() => navigate(`/hotel/${mainHotel._id}`)}
              className="group relative w-full cursor-pointer overflow-hidden border-0 bg-transparent shadow-none ring-0"
            >
              <div className="relative h-[600px] w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-blue-900/10">
                <img
                  src={getDisplayPhoto(mainHotel.photo)}
                  alt={mainHotel.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent transition-opacity duration-500" />

                <Badge className="absolute right-6 top-6 flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-white shadow-xl backdrop-blur-md">
                  <Star
                    size={14}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="font-bold">
                    {mainHotel.rating || "New"}
                  </span>
                </Badge>

                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="mb-2 flex items-center gap-2 text-white/80">
                    <MapPin size={16} />

                    <span className="text-sm font-medium tracking-wide">
                      {mainHotel.city}
                    </span>
                  </div>

                  <h3 className="mb-2 text-4xl font-bold">
                    {mainHotel.name}
                  </h3>

                  <p className="text-xl font-light text-white/90">
                    Starting from{" "}
                    <span className="font-semibold text-white">
                      {formatPrice(mainHotel.price)}₫
                    </span>
                    <span className="text-base"> / night</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* SIDE HOTELS */}
          <div className="flex w-full flex-col gap-8 lg:w-[calc(32%-1rem)]">
            {sideHotels.map((hotel) => (
              <Card
                key={hotel._id}
                onClick={() => navigate(`/hotel/${hotel._id}`)}
                className="group flex flex-1 cursor-pointer flex-col border-0 bg-transparent shadow-none ring-0"
              >
                <div className="relative h-[220px] overflow-hidden rounded-[1.5rem] shadow-lg transition-all duration-500 group-hover:shadow-blue-500/10">
                  <img
                    src={getDisplayPhoto(hotel.photo)}
                    alt={hotel.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {hotel.featured && (
                    <Badge className="absolute left-4 top-4 rounded-full border-none bg-slate-900/60 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="px-1 pt-5">
                  <div className="mb-1 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-black leading-tight text-slate-900 transition-colors group-hover:text-blue-600">
                      {hotel.name}
                    </h3>

                    <div className="flex shrink-0 items-center gap-1 text-sm text-slate-500">
                      <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span>{hotel.rating || "New"}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-4">
                    <p className="text-sm font-bold uppercase tracking-tight text-slate-400">
                      {hotel.city}
                    </p>

                    <p className="text-right">
                      <span className="text-lg font-black text-blue-600">
                        {formatPrice(hotel.price)}₫
                      </span>

                      <span className="ml-1 text-xs text-slate-400">
                        / night
                      </span>
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedHotels;