import React from "react";
import {
  Search,
  Building2,
  BedDouble,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Search Your Destination",
    description:
      "Enter the city or destination you would like to visit.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose a Property",
    description:
      "Compare locations, amenities, ratings, and prices.",
    icon: Building2,
  },
  {
    number: "03",
    title: "Select Your Room",
    description:
      "Explore available room types and choose the perfect one for your stay.",
    icon: BedDouble,
  },
];

const BookingSteps = () => {
  return (
    <section id="how-it-works" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">
            How It Works
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Book Your Stay in 3 Simple Steps
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500 md:text-lg">
            From finding your destination to choosing the perfect room,
            your next stay is only a few clicks away.
          </p>
        </div>

        {/* STEPS */}
        <div className="mt-14 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <React.Fragment key={step.number}>
                <div className="group relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
                  {/* STEP NUMBER */}
                  <span className="absolute right-6 top-5 text-5xl font-black text-slate-100 transition group-hover:text-indigo-50">
                    {step.number}
                  </span>

                  {/* STEP ICON */}
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon size={26} />
                  </div>

                  {/* STEP CONTENT */}
                  <h3 className="relative mt-6 text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="relative mt-3 leading-7 text-slate-500">
                    {step.description}
                  </p>
                </div>

                {/* ARROW BETWEEN STEPS */}
                {index < steps.length - 1 && (
                  <>
                    <ArrowRight
                      className="hidden text-indigo-300 md:block"
                      size={28}
                    />

                    <ArrowDown
                      className="mx-auto text-indigo-300 md:hidden"
                      size={28}
                    />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BookingSteps;