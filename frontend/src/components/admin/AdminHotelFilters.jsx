import React from "react";
import { Search, X } from "lucide-react";

const AdminHotelFilters = ({ status, onStatusChange, search, onSearchChange }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      {[
        ["pending", "Review queue"],
        ["active", "Published properties"],
      ].map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => onStatusChange(value)}
          className={`rounded-md px-4 py-2 text-sm font-bold transition ${
            status === value
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>

    <label className="relative block w-full sm:w-80">
      <span className="sr-only">Search properties</span>
      <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search name, city, or host"
        className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      {search && (
        <button 
          type="button"
          title="Clear search"
          onClick={() => onSearchChange("")}
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={15} />
        </button>
      )}
    </label>
  </div>
);

export default AdminHotelFilters;
