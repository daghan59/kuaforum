import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "leaflet/dist/leaflet.css";

export default function Harita() {
  const [kuaforler, setKuaforler] = useState([]);

  useEffect(() => {
    const fetchKuaforler = async () => {
      const kuaforCol = collection(db, "kuaforler");
      const kuaforSnapshot = await getDocs(kuaforCol);
      const kuaforList = kuaforSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setKuaforler(kuaforList);
    };

    fetchKuaforler();
  }, []);

  // Varsayılan merkez (kuaförlerin ortalaması ya da bir şehir koordinatı)
  const defaultCenter = [41.165, 27.805];

  return (
    <div className="h-screen">
      <MapContainer center={defaultCenter} zoom={13} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {kuaforler.map((k) =>
          k.koordinatlar ? (
            <Marker
              key={k.id}
              position={[k.koordinatlar.lat, k.koordinatlar.lng]}
            >
              <Popup>
                <strong>{k.isim}</strong><br />
                <Link to={`/kuafor-store/${k.id}`} className="text-blue-600 underline">
                  Profili Gör
                </Link>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
