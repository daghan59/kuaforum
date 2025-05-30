import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import RandevuTakvimi from "../components/RandevuTakvimi";

export default function KuaforPanel() {
  const { id } = useParams();

  const [randevular, setRandevular] = useState([]);
  const [hizmetler, setHizmetler] = useState([]);
  const [berberler, setBerberler] = useState([]);
  const [galeri, setGaleri] = useState([]);

  // Yeni hizmet için state’ler
  const [yeniHizmetIsmi, setYeniHizmetIsmi] = useState("");
  const [yeniHizmetFiyati, setYeniHizmetFiyati] = useState("");
  const [yeniHizmetDetayi, setYeniHizmetDetayi] = useState("");

  // Yeni berber için state
  const [yeniBerber, setYeniBerber] = useState("");

  // Resim yükleme için
  const [seciliDosya, setSeciliDosya] = useState(null);

  const DURUMLAR = ["Beklemede", "Onaylandı", "Tamamlandı", "İptal Edildi"];

  // Veri çekme fonksiyonları
  const fetchKuaforRandevular = async () => {
    const q = query(collection(db, "randevular"), where("kuaforId", "==", id));
    const snapshot = await getDocs(q);
    const docsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Randevular:", docsData); // Kontrol için log
    setRandevular(docsData);
  };

  const fetchHizmetler = async () => {
    const snapshot = await getDocs(collection(db, "kuaforler", id, "hizmetler"));
    setHizmetler(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchBerberler = async () => {
    const snapshot = await getDocs(collection(db, "kuaforler", id, "berberler"));
    setBerberler(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchGaleri = async () => {
    const snapshot = await getDocs(collection(db, "kuaforler", id, "galeri"));
    setGaleri(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchKuaforRandevular();
    fetchHizmetler();
    fetchBerberler();
    fetchGaleri();
  }, [id]);

  // Silme işlemleri
  const handleSil = async (randevuId) => {
    if (!window.confirm("Bu randevuyu silmek istiyor musun?")) return;
    await deleteDoc(doc(db, "randevular", randevuId));
    alert("Randevu silindi.");
    fetchKuaforRandevular();
  };

  const handleHizmetSil = async (hizmetId) => {
    await deleteDoc(doc(db, "kuaforler", id, "hizmetler", hizmetId));
    fetchHizmetler();
  };

  const handleBerberSil = async (berberId) => {
    await deleteDoc(doc(db, "kuaforler", id, "berberler", berberId));
    fetchBerberler();
  };

  // Ekleme işlemleri
  const handleHizmetEkle = async () => {
    if (!yeniHizmetIsmi.trim()) return alert("Hizmet adı boş olamaz.");
    if (!yeniHizmetFiyati.trim() || isNaN(yeniHizmetFiyati)) return alert("Geçerli bir fiyat giriniz.");

    await addDoc(collection(db, "kuaforler", id, "hizmetler"), {
      isim: yeniHizmetIsmi.trim(),
      fiyat: parseFloat(yeniHizmetFiyati),
      detay: yeniHizmetDetayi.trim(),
    });

    setYeniHizmetIsmi("");
    setYeniHizmetFiyati("");
    setYeniHizmetDetayi("");
    fetchHizmetler();
  };

  const handleBerberEkle = async () => {
    if (!yeniBerber.trim()) return alert("Berber adı boş olamaz.");
    await addDoc(collection(db, "kuaforler", id, "berberler"), {
      isim: yeniBerber.trim(),
    });
    setYeniBerber("");
    fetchBerberler();
  };

  // Durum değiştirme
  const handleDurumDegistir = async (randevuId, yeniDurum) => {
    await updateDoc(doc(db, "randevular", randevuId), { durum: yeniDurum });
    fetchKuaforRandevular();
  };

  // Resim yükleme
  const handleResimYukle = async () => {
    if (!seciliDosya) return alert("Lütfen bir dosya seçin.");

    const dosyaAdi = uuidv4() + "-" + seciliDosya.name;
    const storageRef = ref(storage, `kuaforler/${id}/${dosyaAdi}`);

    await uploadBytes(storageRef, seciliDosya);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "kuaforler", id, "galeri"), { url });

    setSeciliDosya(null);
    fetchGaleri();
  };

  // Resim silme
  const handleResimSil = async (docId, url) => {
    if (!window.confirm("Bu resmi silmek istiyor musunuz?")) return;

    await deleteDoc(doc(db, "kuaforler", id, "galeri", docId));

    // Firebase storage'dan resmi sil
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);

    fetchGaleri();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Kuaför Paneli</h1>

      {/* Takvim Bölümü */}
      <h2 className="text-lg font-semibold mt-6 mb-2">Randevu Takvimi</h2>
      {randevular.length > 0 ? (
        <RandevuTakvimi randevular={randevular} />
      ) : (
        <p>Henüz randevu yok.</p>
      )}


      {/* Randevular Liste */}
      <h2 className="text-lg font-semibold mt-6 mb-2">Randevular</h2>
      {randevular.map((r) => (
        <div key={r.id} className="border p-3 rounded mb-3 shadow-sm bg-white">
          <p><strong>Tarih:</strong> {r.tarih}</p>
          <p><strong>Saat:</strong> {r.saat}</p>
          <p><strong>Müşteri:</strong> {r.kullaniciAdi} ({r.email})</p>

          <label className="block mt-2">
            <span className="text-sm font-semibold">Durum:</span>
            <select
              value={r.durum || "Beklemede"}
              onChange={(e) => handleDurumDegistir(r.id, e.target.value)}
              className="border rounded px-2 py-1 ml-2"
            >
              {DURUMLAR.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

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
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Yeni hizmet adı"
          value={yeniHizmetIsmi}
          onChange={(e) => setYeniHizmetIsmi(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Fiyat (TL)"
          value={yeniHizmetFiyati}
          onChange={(e) => setYeniHizmetFiyati(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Detay (opsiyonel)"
          value={yeniHizmetDetayi}
          onChange={(e) => setYeniHizmetDetayi(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleHizmetEkle}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Hizmet Ekle
        </button>
      </div>
      {hizmetler.map((h) => (
        <div
          key={h.id}
          className="border p-2 rounded mb-2 bg-gray-50 flex justify-between items-start"
        >
          <div>
            <h3 className="font-semibold">{h.isim}</h3>
            <p className="text-sm text-gray-700">{h.detay || "-"}</p>
            <p className="text-sm font-medium mt-1">{h.fiyat ? `${h.fiyat} TL` : "-"}</p>
          </div>
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
        <div
          key={b.id}
          className="flex justify-between items-center p-2 border-b"
        >
          <span>{b.isim || b.id}</span>
          <button
            onClick={() => handleBerberSil(b.id)}
            className="text-red-500 hover:underline text-sm"
          >
            Sil
          </button>
        </div>
      ))}

      {/* Galeri Yönetimi */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Galeri Yönetimi</h2>

        <input
          type="file"
          onChange={(e) => setSeciliDosya(e.target.files[0])}
          accept="image/*"
          className="mb-2"
        />
        <button
          onClick={handleResimYukle}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Resim Yükle
        </button>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {galeri.map((resim) => (
            <div key={resim.id} className="relative group">
              <img
                src={resim.url}
                alt="Kuaför Resmi"
                className="w-full h-24 object-cover rounded"
              />
              <button
                onClick={() => handleResimSil(resim.id, resim.url)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                title="Resmi Sil"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
