import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
} from "firebase/firestore";

export default function Kuafor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [hizmetler, setHizmetler] = useState([]);
  const [seciliHizmet, setSeciliHizmet] = useState(null);

  const [yorumlar, setYorumlar] = useState([]);
  const [yorum, setYorum] = useState("");
  const [puan, setPuan] = useState(5);

  const [yorumYapabilir, setYorumYapabilir] = useState(false); // Yorum formunu gösterme kontrolü

  // Hizmetleri çek
  useEffect(() => {
    const fetchHizmetler = async () => {
      const hizmetRef = collection(db, "kuaforler", id, "hizmetler");
      const snapshot = await getDocs(hizmetRef);
      const veriler = snapshot.docs.map((doc) => doc.data().isim);
      setHizmetler(veriler);
    };
    fetchHizmetler();
  }, [id]);

  // Seçili hizmet
  useEffect(() => {
    if (location.state?.hizmet) {
      setSeciliHizmet(location.state.hizmet);
    }
  }, [location.state]);

  // Yorumları çek
  useEffect(() => {
    const fetchYorumlar = async () => {
      const q = query(
        collection(db, "kuaforler", id, "yorumlar"),
        orderBy("tarih", "desc")
      );
      const snap = await getDocs(q);
      const yorumlarData = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setYorumlar(yorumlarData);
    };

    fetchYorumlar();
  }, [id]);

  // Randevu kontrolü: kullanıcı yorum yapabilir mi?
  useEffect(() => {
    const checkYorumHakki = async () => {
      const user = auth.currentUser;
      if (!user) {
        setYorumYapabilir(false);
        return;
      }

      // Kullanıcının kuafördeki randevularını bul
      const randevuRef = collection(db, "randevular");
      const q = query(
        randevuRef,
        where("kuaforId", "==", id),
        where("email", "==", user.email)
      );

      const snap = await getDocs(q);
      if (snap.empty) {
        setYorumYapabilir(false);
        return;
      }

      // En son randevu zamanı + 30 dk geçti mi kontrol et
      let yorumHakki = false;
      const now = new Date();

      snap.docs.forEach((doc) => {
        const data = doc.data();
        const randevuTarih = new Date(data.tarih + " " + data.saat); 
        // Firestore’da tarih ve saat formatına göre değiştirmen gerekebilir
        const randevuSonrasi = new Date(randevuTarih.getTime() + 30 * 60 * 1000);
        if (now > randevuSonrasi) {
          yorumHakki = true;
        }
      });

      setYorumYapabilir(yorumHakki);
    };

    checkYorumHakki();
  }, [id]);

  // Yorum ekle
  const handleYorumEkle = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("Yorum yapabilmek için giriş yapmalısınız.");
      return;
    }
    if (yorum.trim() === "") {
      alert("Lütfen yorumunuzu yazın.");
      return;
    }
    if (!yorumYapabilir) {
      alert("Randevun tamamlandıktan sonra puan verebilirsiniz.");
      return;
    }

    await addDoc(collection(db, "kuaforler", id, "yorumlar"), {
      kullaniciAdi: user.displayName || user.email,
      puan,
      yorum,
      tarih: serverTimestamp(),
    });

    setYorum("");
    setPuan(5);

    // Yorumları güncelle
    const q = query(
      collection(db, "kuaforler", id, "yorumlar"),
      orderBy("tarih", "desc")
    );
    const snap = await getDocs(q);
    const yorumlarData = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setYorumlar(yorumlarData);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kuaför ID: {id}</h1>

      {/* Hizmetler */}
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

      {/* Randevu butonu */}
      <button
        onClick={() => {
          if (!seciliHizmet) return alert("Lütfen bir hizmet seçin!");
          navigate(`/randevu/${id}`, { state: { hizmet: seciliHizmet } });
        }}
        className="bg-blue-600 text-white w-full py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition mb-8"
      >
        Randevu Al
      </button>

      {/* Yorum ve Puan Formu */}
      <h2 className="text-xl font-semibold mb-4">Yorumlar ve Puanlar</h2>
      {yorumYapabilir ? (
        <form onSubmit={handleYorumEkle} className="mb-6 flex flex-col gap-3">
          <label>
            Puan:
            <select
              value={puan}
              onChange={(e) => setPuan(Number(e.target.value))}
              className="ml-2 border rounded px-2 py-1"
            >
              {[5, 4, 3, 2, 1].map((p) => (
                <option key={p} value={p}>
                  {p} ⭐
                </option>
              ))}
            </select>
          </label>
          <textarea
            value={yorum}
            onChange={(e) => setYorum(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            className="border rounded p-2"
            rows={4}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Yorum Gönder
          </button>
        </form>
      ) : (
        <p className="mb-6 text-gray-600">
          Randevun tamamlandıktan sonra puan ve yorum yapabilirsiniz.
        </p>
      )}

      {/* Yorum Listesi */}
      <div>
        {yorumlar.length === 0 && <p>Henüz yorum yok.</p>}
        {yorumlar.map((y) => (
          <div
            key={y.id}
            className="border p-3 rounded mb-3 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-1">
              <strong>{y.kullaniciAdi}</strong>
              <span>{y.puan} ⭐</span>
            </div>
            <p>{y.yorum}</p>
            <small className="text-gray-500">
              {y.tarih?.toDate
                ? y.tarih.toDate().toLocaleString()
                : "Tarih yok"}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
