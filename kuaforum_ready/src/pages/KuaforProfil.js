import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function KuaforProfil() {
  const { id } = useParams(); // kuaför ID
  const [form, setForm] = useState({
    isim: "",
    adres: "",
    telefon: "",
    aciklama: "",
  });

  const [loading, setLoading] = useState(true);

  // Mevcut veriyi Firestore'dan çek
  useEffect(() => {
    const fetchProfile = async () => {
      const ref = doc(db, "kuaforler", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setForm(snap.data());
      }
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  // Güncelleme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    const ref = doc(db, "kuaforler", id);
    await setDoc(ref, form, { merge: true });
    alert("Profil başarıyla güncellendi.");
  };

  // Form kontrolü
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Profil Bilgileri</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label className="block mb-1">Kuaför Adı</label>
          <input
            type="text"
            name="isim"
            value={form.isim}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Adres</label>
          <input
            type="text"
            name="adres"
            value={form.adres}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Telefon</label>
          <input
            type="text"
            name="telefon"
            value={form.telefon}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Açıklama</label>
          <textarea
            name="aciklama"
            value={form.aciklama}
            onChange={handleChange}
            rows={4}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
