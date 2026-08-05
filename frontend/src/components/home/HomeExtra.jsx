import React from "react";
import {
  Search,
  MapPinned,
  BedDouble,
} from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Easy Discovery",
    description:
      "Search by destination and explore available properties in a simple experience.",
    icon: Search,
  },
  {
    title: "Clear Information",
    description:
      "Review property locations, amenities, policies, prices, and room details.",
    icon: MapPinned,
  },
  {
    title: "Multiple Stay Options",
    description:
      "Explore hotels and homestays for different types of journeys.",
    icon: BedDouble,
  },
];

const HomeExtra = () => {
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
            A simpler way to explore
          </p>

          <h2 className="mt-3 font-serif text-4xl font-medium text-slate-900 sm:text-5xl">
            Everything you need to find your stay
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            Explore destinations, compare property information, and
            choose a room that fits your journey.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                variants={item}
                whileHover={{ y: -6 }}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:border-blue-200 hover:bg-white hover:shadow-xl"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={25} />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HomeExtra;
