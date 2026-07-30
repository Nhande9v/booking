import React from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, MapPin } from "lucide-react";

const HomeCallToAction = () => {
  return (
    <section className="bg-white px-6 pb-20 pt-4">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 px-6 py-14 sm:px-12 lg:py-16">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/40 blur-[80px]" />
        <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-cyan-100/50 blur-[80px]" />

        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
              <MapPin size={15} />
              Start your journey
            </div>

            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight text-slate-900 sm:text-5xl">
              Find a place that feels right
              <span className="text-blue-600"> for your next stay.</span>
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-500">
              Search available properties, compare your options, and
              explore the details before choosing your stay.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              to="/search"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98]"
            >
              <Search size={19} />
              Explore properties
            </Link>

            <Link
              to="/become-a-host"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 active:scale-[0.98]"
            >
              List your property
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCallToAction;