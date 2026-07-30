import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { List, Map } from "lucide-react";
import { removeAccents } from "@/lib/stringUtils";
import api from "../lib/axios";
import MapComponent from "@/components/home/MapComponent";
import HotelSidebar from "@/components/searchpage/HotelSidebar";

const defaultLocation = {
  lat: 16.0544,
  lng: 108.2022,
  name: "Da Nang",
};

const SearchPage = () => {
  const location = useLocation();
  const searchLocation = location.state || defaultLocation;
  const { lat, lng, name } = searchLocation;

  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [mobileView, setMobileView] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const displayName = name?.split(",")[0] || "Da Nang";

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError("");
      setSelectedHotel(null);

      try {
        const res = await api.get("/hotels");

        const filteredHotels = res.data.filter((hotel) => {
          if (!name?.trim()) return true;

          const hotelCity = removeAccents(hotel.city || "");
          const searchName = removeAccents(name);

          return (
            hotelCity.includes(searchName) ||
            searchName.includes(hotelCity)
          );
        });

        setHotels(filteredHotels);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("Unable to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [lat, lng, name]);

  const mappedHotels = hotels.filter(
    (hotel) =>
      Number.isFinite(Number(hotel.lat)) &&
      Number.isFinite(Number(hotel.lng))
  );

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
  };

  const showHotelOnMap = (hotel) => {
    setSelectedHotel(hotel);
    setMobileView("map");
  };

  return (
    <div className="relative h-[calc(100vh-70px)] overflow-hidden bg-slate-100">
      {/* MOBILE VIEW SWITCH */}
      <div className="absolute bottom-5 left-1/2 z-[1000] flex -translate-x-1/2 rounded-full border border-slate-200 bg-white p-1 shadow-xl md:hidden">
        <button
          type="button"
          onClick={() => setMobileView("list")}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
            mobileView === "list"
              ? "bg-blue-600 text-white"
              : "text-slate-600"
          }`}
        >
          <List size={17} />
          List
        </button>

        <button
          type="button"
          onClick={() => setMobileView("map")}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
            mobileView === "map"
              ? "bg-blue-600 text-white"
              : "text-slate-600"
          }`}
        >
          <Map size={17} />
          Map
        </button>
      </div>

      <div className="flex h-full w-full">
        <aside
          className={`h-full w-full shrink-0 md:block md:w-auto ${
            mobileView === "list" ? "block" : "hidden"
          }`}
        >
          <HotelSidebar
            hotels={hotels}
            name={displayName}
            loading={loading}
            error={error}
            selectedHotel={selectedHotel}
            setSelectedHotel={handleHotelSelect}
            showHotelOnMap={showHotelOnMap}
          />
        </aside>

        <main
          className={`relative h-full flex-1 p-2 md:block ${
            mobileView === "map" ? "block" : "hidden"
          }`}
        >
          <MapComponent
            center={[lat, lng]}
            hotels={mappedHotels}
            selectedHotel={selectedHotel}
            onMarkerClick={handleHotelSelect}
          />

          <div className="pointer-events-none absolute left-5 top-5 z-[500] hidden rounded-2xl border border-white/50 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md md:block">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Map area
            </p>

            <p className="mt-1 font-bold text-slate-900">
              {displayName}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;