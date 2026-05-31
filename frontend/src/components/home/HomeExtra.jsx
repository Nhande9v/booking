import React from "react";
import { ShieldCheck, Headset, Lock } from "lucide-react";
import { motion } from "framer-motion";

const HomeExtra = () => {
  const extras = [
    {
      title: "Curated Precision",
      desc: "Every property in our portfolio is hand-vetted by our editorial team for architectural merit and service excellence.",
      icon: ShieldCheck,
    },
    {
      title: "Concierge Support",
      desc: "Dedicated haven-specialists available 24/7 to manage your itinerary and special requests.",
      icon: Headset,
    },
    {
      title: "Secure Sanctuary",
      desc: "Your data and payments are protected by industry-leading encryption and privacy protocols.",
      icon: Lock,
    },
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10"
      >
        {extras.map((itemData, index) => {
          const Icon = itemData.icon;

          return (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -6 }}
              className="group p-6 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100"
            >
              <div className="p-4 bg-blue-50 rounded-xl inline-block mb-4 group-hover:bg-blue-600 transition">
                <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition" />
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {itemData.title}
              </h3>

              <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                {itemData.desc}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default HomeExtra;