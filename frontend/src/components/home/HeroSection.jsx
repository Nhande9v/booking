import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, LoaderCircle } from "lucide-react";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    const destination = searchQuery.trim();

    if (!destination) {
      setError("Please enter a destination.");
      return;
    }

    setSearching(true);
    setError("");

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`,
        { headers: { Accept: "application/json" } }
      );

      if (!res.ok) throw new Error("Search request failed.");

      const data = await res.json();

      if (!data.length) {
        setError("Destination not found. Please try another location.");
        return;
      }

      const { lat, lon, display_name } = data[0];

      navigate("/search", {
        state: {
          lat: Number.parseFloat(lat),
          lng: Number.parseFloat(lon),
          name: display_name,
        },
      });
    } catch (err) {
      console.error("Destination search failed:", err);
      setError("Unable to search right now. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <section className="bg-slate-50 p-3 sm:p-5">
      <div className="relative flex min-h-[620px] items-center overflow-hidden rounded-[2rem] bg-slate-950 shadow-xl sm:rounded-[2.5rem]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hotel.jpg')" }}
        />

        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-20 text-center">
          <h1 className="font-serif text-4xl font-medium leading-tight text-white sm:text-6xl lg:text-7xl">
            Find your perfect place
            <span className="block italic text-blue-300">to stay.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Discover hotels, apartments, and unique stays for your next journey.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-3xl flex-col gap-2 rounded-[1.75rem] bg-white/95 p-2.5 shadow-2xl backdrop-blur-md sm:flex-row"
          >
            <div className="flex min-h-16 flex-1 items-center gap-4 px-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <MapPin size={21} />
              </div>

              <div className="flex-1 text-left">
                <label
                  htmlFor="destination"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Destination
                </label>

                <input
                  id="destination"
                  value={searchQuery}
                  disabled={searching}
                  placeholder="Where are you going?"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setError("");
                  }}
                  className="mt-1 w-full bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={searching}
              className="inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-[#4DA3FF] px-8 font-bold text-white transition hover:bg-[#2E8EFF] active:scale-[0.98] disabled:opacity-60"
            >
              {searching ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  <Search size={20} />
                  Search
                </>
              )}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-200">
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/70">
            <span>Clear property information</span>
            <span>•</span>
            <span>Simple search experience</span>
            <span>•</span>
            <span>Multiple stay options</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;