import React from "react";
import { Building2, Home, Landmark } from "lucide-react";

const options = [
  {
    key: "Hotel",
    title: "Hotel",
    desc: "Hotels, hostels, guesthouses, serviced apartments.",
    icon: <Building2 size={28} />,
  },
  {
    key: "Apartment",
    title: "Apartment",
    desc: "Fully furnished apartments and residential flats.",
    icon: <Home size={28} />,
  },
  {
    key: "Homestay",
    title: "Homestay",
    desc: "Local stays, unique houses, and cozy rooms.",
    icon: <Landmark size={28} />,
  },
];

const Step0PropertyType = ({ next, update }) => {
  const handleSelect = (type) => {
    update({ type });
    next();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white px-4 py-16">
      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Start earning
            </span>{" "}
            with your property
          </h1>

          <p className="text-slate-500 mt-3 text-base">
            It only takes a few minutes to get listed 
          </p>
        </div>

        {/* OPTIONS */}
        <div className="grid md:grid-cols-3 gap-6">
          {options.map((item) => (
            <div
              key={item.key}
              onClick={() => handleSelect(item.key)}
              className="
                group cursor-pointer rounded-2xl p-6
                bg-gradient-to-br from-white to-slate-50
                border border-slate-200
                hover:border-blue-500
                hover:shadow-2xl hover:shadow-blue-100/50
                hover:ring-2 hover:ring-blue-400
                transition-all duration-300
                active:scale-[0.97]
                flex flex-col justify-between
              "
            >
              {/* TOP */}
              <div className="space-y-4">

                <div className="
                  w-14 h-14 flex items-center justify-center
                  rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100
                  text-blue-600
                  group-hover:from-blue-600 group-hover:to-indigo-500
                  group-hover:text-white
                  group-hover:scale-110
                  transition-all duration-300
                ">
                  {item.icon}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

              </div>

              {/* BUTTON */}
              <div className="mt-6">
                <div className="
                  w-full py-2.5 text-sm font-semibold text-white
                  bg-gradient-to-r from-blue-500 to-indigo-500
                  rounded-lg text-center
                  opacity-90
                  group-hover:opacity-100
                  group-hover:shadow-lg
                  transition-all
                ">
                  Get started →
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* FOOTER */}
        <p className="text-center mt-10 text-xs text-slate-400">
          You can change this later in your dashboard
        </p>

      </div>
    </div>
  );
};

export default Step0PropertyType;