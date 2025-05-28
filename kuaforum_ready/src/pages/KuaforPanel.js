import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc
} from "firebase/firestore";
import { db } from "../firebase";

export default function KuaforPanel() {
  const { id } = useParams();
  const [randevular, setRandevular] = useState([]);
  const [hizmetler, setHizmetler] = useState([]);
  const [berberler, setBerberler] = useState([]);
  const [yeniHizmet, setYeniHizmet] = useState("");
  const [yeniBerber, setYeniBerber] = useState("");

  // Randevuları getir
  const fetchKuaforRandevular = async () => {
    const q = query(collection(db, "randevular"), where("kuaforId", "==", id));
    const snapshot = await getDocs(q);
    const veriler = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRandevular(veriler);
  };

  // Hizmetleri getir
  const fetchHizmetler = async () => {
    const snapshot = await getDocs(collection(db, "kuaforler", id, "hizmetler"));
    const veriler = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setHizmetler(veriler);
  };

  // Berberleri getir
  const fetchBerberler = async () => {
    const snapshot = await getDocs(collection(db, "kuaforler", id, "berberler"));
    const veriler = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setBerberler(veriler);
  };

  useEffect(() => {
    fetchKuaforRandevular();
    fetchHizmetler();
    fetchBerberler();
  }, [id]);

  // Randevu sil
  const handleSil = async (randevuId) => {
    const onay = window.confirm("Bu randevuyu silmek istiyor musun?");
    if (!onay) return;

    await deleteDoc(doc(db, "randevular", randevuId));
    alert("Randevu silindi.");
    fetchKuaforRandevular();
  };

  // Hizmet sil
  const handleHizmetSil = async (hizmetId) => {
    await deleteDoc(doc(db, "kuaforler", id, "hizmetler", hizmetId));
    fetchHizmetler();
  };

  // Hizmet ekle
  const handleHizmetEkle = async () => {
    if (!yeniHizmet.trim()) return alert("Hizmet adı boş olamaz.");
    await addDoc(collection(db, "kuaforler", id, "hizmetler"), {
      isim: yeniHizmet.trim()
    });
    setYeniHizmet("");
    fetchHizmetler();
  };

  // Berber ekle
  const handleBerberEkle = async () => {
    if (!yeniBerber.trim()) return alert("Berber adı boş olamaz.");
    await addDoc(collection(db, "kuaforler", id, "berberler"), {
      isim: yeniBerber.trim()
    });
    setYeniBerber("");
    fetchBerberler();
  };

  // Berber sil
  const handleBerberSil = async (berberId) => {
    await deleteDoc(doc(db, "kuaforler", id, "berberler", berberId));
    fetchBerberler();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Kuaför Paneli</h1>

      {/* Randevular */}
      <h2 className="text-lg font-semibold mt-6 mb-2">Randevular</h2>
      {randevular.map((r) => (
        <div key={r.id} className="border p-3 rounded mb-3 shadow-sm bg-white">
          <p><strong>Tarih:</strong> {r.tarih}</p>
          <p><strong>Saat:</strong> {r.saat}</p>
          <p><strong>Müşteri:</strong> {r.kullaniciAdi} ({r.email})</p>
          <button
            onClick={() => handleSil(r.id)}
            className="text-red-500 text-sm mt-2 hover:underline"
          >
            ❌ Randevuyu İptal Et
          </button>
        </div>
      ))}

      {/* Hizmetler */}
      <h2 className="text-lg font-semibold mt-8 mb-2">Hizmetleri Yönet</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Yeni hizmet adı"
          value={yeniHizmet}
          onChange={(e) => setYeniHizmet(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
        <button
          onClick={handleHizmetEkle}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ekle
        </button>
      </div>
      {hizmetler.map((h) => (
        <div key={h.id} className="flex justify-between items-center p-2 border-b">
          <span>{h.isim}</span>
          <button
            onClick={() => handleHizmetSil(h.id)}
            className="text-red-500 hover:underline text-sm"
          >
            Sil
          </button>
        </div>
      ))}

      {/* Berberler */}
      <h2 className="text-lg font-semibold mt-8 mb-2">Berberleri Yönet</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Yeni berber adı"
          value={yeniBerber}
          onChange={(e) => setYeniBerber(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
        <button
          onClick={handleBerberEkle}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ekle
        </button>
      </div>
      {berberler.map((b) => (
        <div key={b.id} className="flex justify-between items-center p-2 border-b">
          <span>{b.isim || b.id}</span>
          <button
            onClick={() => handleBerberSil(b.id)}
            className="text-red-500 hover:underline text-sm"
          >
            Sil
          </button>
        </div>
      ))}
    </div>
  );
}
