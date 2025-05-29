import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

export default function BenimRandevularim() {
  const [randevular, setRandevular] = useState([]);
  const [kuaforlarMap, setKuaforlarMap] = useState({});
  const [yukleniyor, setYukleniyor] = useState(true);
  const navigate = useNavigate();
  const kullanici = auth.currentUser;

  // Kuaför isimlerini getirmek için
  useEffect(() => {
    const fetchKuaforler = async () => {
      const snapshot = await getDocs(collection(db, "kuaforler"));
      const map = {};
      snapshot.docs.forEach(doc => {
        map[doc.id] = doc.data().isim || "Kuaför";
      });
      setKuaforlarMap(map);
    };
    fetchKuaforler();
  }, []);

  // Kullanıcının randevularını getir
  useEffect(() => {
    if (!kullanici) {
      navigate("/"); // kullanıcı yoksa anasayfaya yönlendir
      return;
    }

    const fetchRandevular = async () => {
      const q = query(
        collection(db, "randevular"),
        where("email", "==", kullanici.email)
      );
      const snapshot = await getDocs(q);
      const liste = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRandevular(liste);
      setYukleniyor(false);
    };

    fetchRandevular();
  }, [kullanici, navigate]);

  const handleSil = async (id) => {
    const onay = window.confirm("Bu randevuyu silmek istiyor musun?");
    if (!onay) return;

    await deleteDoc(doc(db, "randevular", id));
    setRandevular((prev) => prev.filter((r) => r.id !== id));
  };

  if (yukleniyor) return <p className="text-center py-4 text-gray-500">Yükleniyor...</p>;

  if (randevular.length === 0) return <p className="text-center py-4">Henüz randevu almadınız.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Randevularım</h1>
      <ul className="space-y-4">
        {randevular.map((r) => (
          <li
            key={r.id}
            className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/kuafor-store/${r.kuaforId}`)}
          >
            <p>
              <strong>Tarih:</strong> {r.tarih}
            </p>
            <p>
              <strong>Saat:</strong> {r.saat}
            </p>
            <p>
              <strong>Kuaför:</strong> {kuaforlarMap[r.kuaforId] || r.kuaforId}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Liste elemanına tıklamayı engelle
                handleSil(r.id);
              }}
              className="mt-2 text-red-600 hover:underline text-sm"
            >
              ❌ Randevuyu İptal Et
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
