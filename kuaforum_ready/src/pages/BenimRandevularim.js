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
  const [yukleniyor, setYukleniyor] = useState(true);
  const navigate = useNavigate();
  const kullanici = auth.currentUser;

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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Randevularım</h1>

      {yukleniyor ? (
        <p>Yükleniyor...</p>
      ) : randevular.length === 0 ? (
        <p>Henüz randevu almadınız.</p>
      ) : (
        <ul className="space-y-4">
          {randevular.map((r) => (
            <li key={r.id} className="border p-4 rounded shadow">
              <p>
                <strong>Tarih:</strong> {r.tarih}
              </p>
              <p>
                <strong>Saat:</strong> {r.saat}
              </p>
              <p>
                <strong>Kuaför:</strong> {r.kuaforId}
              </p>
              <button
                onClick={() => handleSil(r.id)}
                className="mt-2 text-red-600 hover:underline text-sm"
              >
                ❌ Randevuyu İptal Et
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
