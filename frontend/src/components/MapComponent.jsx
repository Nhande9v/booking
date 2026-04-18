import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Component hỗ trợ di chuyển góc nhìn bản đồ
function RecenterMap({ center }) {
    const map = useMap(); // lấy bản đồ
    useEffect(() => {
        map.setView(center, 13); 
    }, [center, map]);
    return null;
}

const MapComponent = ({ center, hotels, onMarkerClick }) => {
    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <RecenterMap center={center} />

                
                {hotels.map((hotel) => (
                    <Marker key={hotel._id} position={[hotel.lat, hotel.lng]}
                    eventHandlers={{
                        click: () => {
                            onMarkerClick(hotel); // Gọi hàm khi người dùng click vào Marker
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