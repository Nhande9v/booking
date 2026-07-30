import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { MapPin, Star } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createMarkerIcon = (active = false) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:${active ? "34px" : "28px"};
        height:${active ? "34px" : "28px"};
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:50% 50% 50% 8px;
        background:${active ? "#1d4ed8" : "#2563eb"};
        border:3px solid white;
        box-shadow:0 8px 20px rgba(15,23,42,.25);
        transform:rotate(-45deg);
      ">
        <div style="
          width:8px;
          height:8px;
          border-radius:50%;
          background:white;
        "></div>
      </div>
    `,
    iconSize: active ? [34, 34] : [28, 28],
    iconAnchor: active ? [17, 34] : [14, 28],
    popupAnchor: [0, active ? -35 : -29],
  });

const DefaultIcon = createMarkerIcon(false);
const ActiveIcon = createMarkerIcon(true);

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("vi-VN");

const getPhoto = (photo) => {
  if (Array.isArray(photo) && photo.length) return photo[0];
  if (typeof photo === "string") return photo.split(",")[0];
  return "/hotel.jpg";
};

const FlyToHotel = ({ hotel }) => {
  const map = useMap();

  useEffect(() => {
    if (!hotel) return;

    const lat = Number(hotel.lat);
    const lng = Number(hotel.lng);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      map.flyTo([lat, lng], 15, { duration: 1.1 });
    }
  }, [hotel, map]);

  return null;
};

const RecenterMap = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 13, { duration: 1 });
  }, [center, map]);

  return null;
};

const ResizeMap = () => {
  const map = useMap();

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });

    observer.observe(map.getContainer());

    return () => observer.disconnect();
  }, [map]);

  return null;
};

const MapComponent = ({
  center,
  hotels = [],
  selectedHotel,
  onMarkerClick,
}) => {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
      <MapContainer
        center={center}
        zoom={13}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ResizeMap />
        <RecenterMap center={center} />
        <FlyToHotel hotel={selectedHotel} />

        {hotels.map((hotel) => {
          const isSelected =
            selectedHotel?._id === hotel._id;

          return (
            <Marker
              key={hotel._id}
              position={[
                Number(hotel.lat),
                Number(hotel.lng),
              ]}
              icon={isSelected ? ActiveIcon : DefaultIcon}
              eventHandlers={{
                click: () => onMarkerClick(hotel),
              }}
            >
              <Popup
                className="hotel-map-popup"
                minWidth={220}
                maxWidth={220}
              >
                <div className="w-[220px] bg-white p-2.5 font-sans">
                  <div className="flex gap-3">
                    <img
                      src={getPhoto(hotel.photo)}
                      alt={hotel.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900">
                        {hotel.name}
                      </h3>

                      <div className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-slate-600">
                        <Star
                          size={12}
                          className="fill-amber-400 text-amber-400"
                        />
                        {hotel.rating || "New"}
                      </div>

                      <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin
                          size={12}
                          className="text-blue-500"
                        />

                        <span className="truncate">
                          {hotel.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2.5">
                    <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      From
                    </span>

                    <span className="whitespace-nowrap text-sm font-black text-blue-600">
                      {formatPrice(hotel.price)}₫

                      <span className="ml-1 text-[9px] font-medium text-slate-400">
                        / night
                      </span>
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;