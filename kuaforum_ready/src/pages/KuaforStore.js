import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Slider from "react-slick";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function KuaforStore() {
  const { id } = useParams();
  const [kuafor, setKuafor] = useState(null);
  const [hizmetler, setHizmetler] = useState([]);
  const [yorumlar, setYorumlar] = useState([]);
  const [berberler, setBerberler] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const kuaforRef = doc(db, "kuaforler", id);
      const kuaforSnap = await getDoc(kuaforRef);
      if (kuaforSnap.exists()) {
        setKuafor(kuaforSnap.data());
      }

      const hizmetlerSnap = await getDocs(collection(db, "kuaforler", id, "hizmetler"));
      setHizmetler(hizmetlerSnap.docs.map(doc => doc.data()));

      const yorumlarSnap = await getDocs(collection(db, "kuaforler", id, "yorumlar"));
      setYorumlar(yorumlarSnap.docs.map(doc => doc.data()));

      const berberlerSnap = await getDocs(collection(db, "kuaforler", id, "berberler"));
      setBerberler(berberlerSnap.docs.map(doc => doc.data()));
    }

    fetchData();
  }, [id]);

  if (!kuafor) return <div className="p-6 text-center">Kuaför bilgileri yükleniyor...</div>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Slider */}
      {kuafor.fotograflar?.length > 0 && (
        <Slider {...sliderSettings}>
          {kuafor.fotograflar.map((foto, i) => (
            <img key={i} src={foto} alt={`Kuaför foto ${i + 1}`} className="w-full h-96 object-cover rounded" />
          ))}
        </Slider>
      )}

      {/* Başlık ve Puan */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{kuafor.isim}</h1>
        <div className="bg-yellow-400 px-3 py-1 rounded font-semibold text-black flex items-center gap-2">
          ⭐ {kuafor.puan?.toFixed(1) || "0.0"} <span>({yorumlar.length} yorum)</span>
        </div>
      </div>

      {/* Adres ve Telefon */}
      <p className="text-gray-700">{kuafor.adres}</p>
      <p className="text-gray-700">Telefon: {kuafor.telefon}</p>

      {/* Harita */}
      {kuafor.koordinatlar?.lat && kuafor.koordinatlar?.lng && (
        <MapContainer
          center={[kuafor.koordinatlar.lat, kuafor.koordinatlar.lng]}
          zoom={15}
          style={{ height: "300px", width: "100%", marginTop: "1rem" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[kuafor.koordinatlar.lat, kuafor.koordinatlar.lng]}>
            <Popup>{kuafor.isim}</Popup>
          </Marker>
        </MapContainer>
      )}

      {/* Hizmetler */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Hizmetler</h2>
        {hizmetler.length > 0 ? (
          <ul className="space-y-4">
            {hizmetler.map((hizmet, i) => (
              <li key={i} className="flex justify-between border p-4 rounded shadow-sm">
                <div>
                  <h3 className="font-semibold">{hizmet.isim}</h3>
                  <p className="text-gray-600">{hizmet.aciklama}</p>
                </div>
                <div className="font-semibold">{hizmet.fiyat}₺</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Hizmet bilgisi bulunmamaktadır.</p>
        )}
      </section>

      {/* Yorumlar */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Yorumlar</h2>
        {yorumlar.length > 0 ? (
          <ul className="space-y-3">
            {yorumlar.map((yorum, i) => (
              <li key={i} className="border-b pb-3">
                <strong>{yorum.kullaniciAdi}</strong>
                <p className="text-gray-700">{yorum.aciklama}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz yorum yok.</p>
        )}
      </section>

      {/* Çalışanlar */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Çalışanlar</h2>
        {berberler.length > 0 ? (
          <div className="flex space-x-6">
            {berberler.map((berber, i) => (
              <div key={i} className="text-center">
                <img
                  src={berber.foto || "https://via.placeholder.com/80"}
                  alt={berber.isim}
                  className="rounded-full w-20 h-20 object-cover mx-auto"
                />
                <p>{berber.isim}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Çalışan bilgisi bulunmamaktadır.</p>
        )}
      </section>
    </div>
  );
}
