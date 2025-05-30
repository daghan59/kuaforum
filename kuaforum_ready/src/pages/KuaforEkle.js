import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const kategoriler = [
  "Kuaför",
  "Berber",
  "Tırnak Salonu",
  "Cilt Bakımı",
  "Kaş ve Kirpik",
  "Masaj",
  "Makyaj",
  "Wellness & Gündüz Spa",
  "Dövme Salonu",
  "Estetik Tıp",
  "Lazer Epilasyon",
  "Ev Hizmetleri",
  "Piercing",
  "Evcil Hayvan Hizmetleri",
  "Diş & Ortodonti",
  "Sağlık & Fitness",
  "Profesyonel Hizmetler",
];

export default function KuaforEkle() {
  const [isim, setIsim] = useState("");
  const [adres, setAdres] = useState("");
  const [telefon, setTelefon] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [kategori, setKategori] = useState(kategoriler[0]); // varsayılan ilk kategori

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isim || !adres || !telefon || !lat || !lng || !kategori) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      // Kuaför dokümanı oluştur
      const kuaforRef = await addDoc(collection(db, "kuaforler"), {
        isim,
        adres,
        telefon,
        foto: fotoUrl,
        koordinatlar: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
        kategori,
        puan: 0,
      });

      // Berberler alt koleksiyonu için örnek belge
      await addDoc(collection(db, "kuaforler", kuaforRef.id, "berberler"), {
        isim: "Örnek Berber",
      });

      // Hizmetler alt koleksiyonu için örnek belge
      await addDoc(collection(db, "kuaforler", kuaforRef.id, "hizmetler"), {
        isim: "Örnek Hizmet",
        fiyat: 100,
        detay: "Örnek hizmet detayı",
      });

      // Yorumlar alt koleksiyonu için örnek belge
      await addDoc(collection(db, "kuaforler", kuaforRef.id, "yorumlar"), {
        kullaniciAdi: "Örnek Müşteri",
        yorum: "Harika kuaför!",
        puan: 5,
      });

      alert("Kuaför ve alt koleksiyonları başarıyla eklendi!");

      // Formu temizle
      setIsim("");
      setAdres("");
      setTelefon("");
      setFotoUrl("");
      setLat("");
      setLng("");
      setKategori(kategoriler[0]);
    } catch (err) {
      console.error("Hata:", err);
      alert("Bir hata oluştu, tekrar deneyin.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4 mt-20"
    >
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

      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      >
        {kategoriler.map((kat) => (
          <option key={kat} value={kat}>
            {kat}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Kuaför Ekle
      </button>
    </form>
  );
}
