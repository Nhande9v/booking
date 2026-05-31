import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// 🔥 Default marker
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🔥 Active marker (to hơn + nổi bật hơn)
const ActiveIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [32, 50],
  iconAnchor: [16, 50],
});

L.Marker.prototype.options.icon = DefaultIcon;


// 🔥 FlyTo thay vì setView
function FlyToHotel({ hotel }) {
  const map = useMap();

  useEffect(() => {
    if (hotel) {
      map.flyTo([hotel.lat, hotel.lng], 15, {
        duration: 1.2, // mượt như app
      });
    }
  }, [hotel]);

  return null;
}

// 🔥 Recenter khi đổi location search
function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 13, { duration: 1 });
  }, [center]);

  return null;
}


const MapComponent = ({ center, hotels, selectedHotel, onMarkerClick }) => {
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔥 Move map khi search */}
        <RecenterMap center={center} />

        {/* 🔥 Move map khi select hotel */}
        <FlyToHotel hotel={selectedHotel} />

        {hotels.map((hotel) => (
          <Marker
            key={hotel._id}
            position={[hotel.lat, hotel.lng]}

            // 🔥 highlight marker
            icon={
              selectedHotel?._id === hotel._id
                ? ActiveIcon
                : DefaultIcon
            }

            eventHandlers={{
              click: () => {
                onMarkerClick(hotel);
              },
            }}
          >
            <Popup>
              <div className="font-sans">
                <p className="font-bold text-slate-900">{hotel.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;