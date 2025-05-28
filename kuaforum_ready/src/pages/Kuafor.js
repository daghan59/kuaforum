import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Kuafor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hizmetler, setHizmetler] = useState([]);
  const [seciliHizmet, setSeciliHizmet] = useState(null);

  // Dinamik veri: Firestore'dan hizmetleri çekiyoruz
  useEffect(() => {
    const fetchHizmetler = async () => {
      const hizmetRef = collection(db, "kuaforler", id, "hizmetler");
      const snapshot = await getDocs(hizmetRef);
      const veriler = snapshot.docs.map((doc) => doc.data().isim);
      setHizmetler(veriler);
    };

    fetchHizmetler();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Kuaför ID: {id}</h1>

      <h2 className="text-lg font-semibold mb-2">Hizmetler</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {hizmetler.map((hizmet, i) => (
          <button
            key={i}
            onClick={() => setSeciliHizmet(hizmet)}
            className={`px-3 py-1 rounded-full text-sm shadow-sm border ${
              seciliHizmet === hizmet
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            {hizmet}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          if (!seciliHizmet) return alert("Lütfen bir hizmet seçin!");
          navigate(`/randevu/${id}`, { state: { hizmet: seciliHizmet } });
        }}
        className="bg-blue-600 text-white w-full py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        Randevu Al
      </button>
    </div>
  );
}
