import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

const kuaforler = [
  {
    id: "1",
    isim: "Berber Kadir",
    lat: 41.1603,
    lng: 27.7999
  },
  {
    id: "2",
    isim: "Haircut Zone",
    lat: 41.1662,
    lng: 27.8125
  }
];

export default function Harita() {
  return (
    <div className="h-screen">
      <MapContainer center={[41.165, 27.805]} zoom={13} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap katkıda bulunanlar'
        />
        {kuaforler.map((k) => (
          <Marker key={k.id} position={[k.lat, k.lng]}>
            <Popup>
              <strong>{k.isim}</strong><br />
              <Link to={`/kuafor/${k.id}`} className="text-blue-600 underline">
                Profili Gör
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
