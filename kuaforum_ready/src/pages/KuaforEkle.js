import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function KuaforEkle() {
  const [isim, setIsim] = useState("");
  const [adres, setAdres] = useState("");
  const [telefon, setTelefon] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isim || !adres || !telefon || !lat || !lng) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await addDoc(collection(db, "kuaforler"), {
        isim,
        adres,
        telefon,
        foto: fotoUrl,
        koordinatlar: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
        puan: 0,
      });
      alert("Kuaför başarıyla eklendi!");
      setIsim("");
      setAdres("");
      setTelefon("");
      setFotoUrl("");
      setLat("");
      setLng("");
    } catch (err) {
      console.error("Hata:", err);
      alert("Bir hata oluştu, tekrar deneyin.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4 mt-20">
      <h2 className="text-xl font-bold mb-4">Kuaför Ekle</h2>
      <input
        type="text"
        placeholder="Kuaför İsmi"
        value={isim}
        onChange={(e) => setIsim(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      <input
        type="text"
        placeholder="Adres"
        value={adres}
        onChange={(e) => setAdres(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      <input
        type="text"
        placeholder="Telefon"
        value={telefon}
        onChange={(e) => setTelefon(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      <input
        type="text"
        placeholder="Fotoğraf URL'si"
        value={fotoUrl}
        onChange={(e) => setFotoUrl(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <div className="flex gap-4">
        <input
          type="number"
          step="any"
          placeholder="Enlem (lat)"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          step="any"
          placeholder="Boylam (lng)"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          required
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Kuaför Ekle
      </button>
    </form>
  );
}
