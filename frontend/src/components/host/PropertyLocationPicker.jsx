import React, { useEffect, useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { toast } from "sonner";
import api from "@/lib/axios";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [16.0544, 108.2022];

const markerIcon = L.divIcon({
  className: "",
  html: '<div style="width:30px;height:30px;display:grid;place-items:center;border-radius:50% 50% 50% 8px;background:#2563eb;border:3px solid white;box-shadow:0 6px 18px rgba(15,23,42,.3);transform:rotate(-45deg)"><div style="width:8px;height:8px;border-radius:50%;background:white"></div></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const MapInteraction = ({ position, onChange }) => {
  const map = useMap();

  useEffect(() => {
    if (position) map.flyTo(position, 16, { duration: 0.8 });
  }, [map, position]);

  useMapEvents({
    click(event) {
      onChange([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
};

const PropertyLocationPicker = ({ city, district, address, lat, lng, onChange }) => {
  const [locating, setLocating] = useState(false);
  const hasPosition = Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
  const position = hasPosition ? [Number(lat), Number(lng)] : null;

  const updatePosition = ([nextLat, nextLng]) => {
    onChange({ lat: nextLat, lng: nextLng });
  };

  const findAddress = async () => {
    if (!city?.trim() || !address?.trim()) {
      toast.error("Enter the city and full address first.");
      return;
    }

    setLocating(true);
    try {
      const response = await api.post("/hotels/geocode-preview", {
        city,
        district,
        address,
      });
      updatePosition([response.data.lat, response.data.lng]);
      toast.success("Location found. Check the pin before continuing.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "We could not locate this address. Add more address details and try again."
      );
    } finally {
      setLocating(false);
    }
  };

  return (
    <div className="space-y-3 border-t border-slate-100 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Property location</p>
          <p className="mt-1 text-xs text-slate-500">
            Find the address, then click the map or drag the pin to the entrance.
          </p>
        </div>
        <button
          type="button"
          onClick={findAddress}
          disabled={locating}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
        >
          <LocateFixed size={17} />
          {locating ? "Finding..." : hasPosition ? "Find again" : "Find on map"}
        </button>
      </div>

      <div className="relative h-64 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        <MapContainer center={position || DEFAULT_CENTER} zoom={position ? 16 : 5} scrollWheelZoom className="h-full w-full">
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapInteraction position={position} onChange={updatePosition} />
          {position && (
            <Marker
              position={position}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend(event) {
                  const nextPosition = event.target.getLatLng();
                  updatePosition([nextPosition.lat, nextPosition.lng]);
                },
              }}
            />
          )}
        </MapContainer>
        {!position && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[500] flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-md">
            <MapPin size={15} className="text-blue-600" />
            Enter an address and choose Find on map.
          </div>
        )}
      </div>

      {position && (
        <p className="text-xs font-medium text-emerald-700">
          Pin selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </p>
      )}
    </div>
  );
};

export default PropertyLocationPicker;
