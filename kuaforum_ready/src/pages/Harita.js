import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Kategori ve ikonları burada tanımlıyoruz (public/icons klasöründe olmalı)
const categories = [
  { name: "Tüm Kategoriler", icon: "/icons/all.png" },
  { name: "Kuaför", icon: "/icons/kuafor.png" },
  { name: "Berber", icon: "/icons/berber.png" },
  { name: "Tırnak Salonu", icon: "/icons/tirnak-salonu.png" },
  { name: "Cilt Bakımı", icon: "/icons/cilt-bakimi.png" },
  { name: "Kaş ve Kirpik", icon: "/icons/kas-kirpik.png" },
  { name: "Masaj", icon: "/icons/masaj.png" },
  { name: "Makyaj", icon: "/icons/makyaj.png" },
  { name: "Wellness & Gündüz Spa", icon: "/icons/wellness.png" },
  { name: "Dövme Salonu", icon: "/icons/dovme.png" },
  { name: "Estetik Tıp", icon: "/icons/estetik-tip.png" },
  { name: "Lazer Epilasyon", icon: "/icons/lazer-epilasyon.png" },
  { name: "Ev Hizmetleri", icon: "/icons/ev-hizmetleri.png" },
  { name: "Piercing", icon: "/icons/piercing.png" },
  { name: "Evcil Hayvan Hizmetleri", icon: "/icons/evcil-hayvan.png" },
  { name: "Diş & Ortodonti", icon: "/icons/dis-ortodonti.png" },
  { name: "Sağlık & Fitness", icon: "/icons/saglik-fitness.png" },
  { name: "Profesyonel Hizmetler", icon: "/icons/profesyonel.png" },
];

// Kategoriye göre Leaflet ikonlarını oluşturuyoruz
const iconMapping = {};
categories.forEach(({ name, icon }) => {
  iconMapping[name] = new L.Icon({
    iconUrl: icon,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
});

export default function Harita() {
  const [kuaforler, setKuaforler] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tüm Kategoriler");

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

  const defaultCenter = [41.165, 27.805];

  // Güncellenmiş ikon alma fonksiyonu
  const getIconByCategory = (category) => {
    if (!category || !iconMapping[category]) {
      return iconMapping["Tüm Kategoriler"];
    }
    return iconMapping[category];
  };

  // Filtreleme: Tüm Kategoriler seçiliyse hepsi gösterilir
  const filteredKuaforler = selectedCategory === "Tüm Kategoriler"
    ? kuaforler
    : kuaforler.filter(k => k.kategori === selectedCategory);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-grow">
        <MapContainer center={defaultCenter} zoom={13} className="h-full w-full z-0">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {filteredKuaforler.map((k) =>
            k.koordinatlar ? (
              <Marker
                key={k.id}
                position={[k.koordinatlar.lat, k.koordinatlar.lng]}
                icon={getIconByCategory(k.kategori || "Tüm Kategoriler")}
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

      <div className="flex justify-around items-center bg-white border-t py-2 shadow-inner">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex flex-col items-center text-xs ${
              selectedCategory === cat.name ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <img src={cat.icon} alt={cat.name} className="w-6 h-6 mb-1" />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
