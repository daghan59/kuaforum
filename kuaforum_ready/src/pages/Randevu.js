import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { auth, db } from "../firebase";
import LoginModal from "../components/LoginModal";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

export default function Randevu() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const secilenHizmet = location.state?.hizmet || "";
  const [modalAcik, setModalAcik] = useState(false);

  const [tarih, setTarih] = useState("");
  const [saat, setSaat] = useState("");
  const [berberler, setBerberler] = useState([]);
  const [secilenBerber, setSecilenBerber] = useState("");

  // Berberleri çek
  useEffect(() => {
    const getirBerberler = async () => {
      const colRef = collection(db, "kuaforler", id, "berberler");
      const snapshot = await getDocs(colRef);
      const veriler = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBerberler(veriler);
    };
    getirBerberler();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      setModalAcik(true);  // Giriş yoksa modal açılır
      return;
    }

    if (!secilenBerber) {
      alert("Lütfen bir berber seçin.");
      return;
    }

    // Aynı saatte berberin başka randevusu var mı kontrol et
    const q = query(
      collection(db, "randevular"),
      where("kuaforId", "==", id),
      where("berberId", "==", secilenBerber),
      where("tarih", "==", tarih),
      where("saat", "==", saat)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      alert("Bu berberin o saatte başka randevusu var. Lütfen başka saat veya berber seçin.");
      return;
    }

    // Randevuyu oluştur
    try {
      await addDoc(collection(db, "randevular"), {
        kuaforId: id,
        berberId: secilenBerber,
        tarih,
        saat,
        hizmet: secilenHizmet,
        kullaniciAdi: user.displayName,
        email: user.email,
        olusturmaZamani: Timestamp.now(),
      });

      alert("Randevunuz oluşturuldu!");
      navigate("/home");
    } catch (err) {
      console.error("🔥 Firebase hatası:", err);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white mt-8 p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Randevu Al</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {secilenHizmet && (
          <p className="text-lg">
            Hizmet: <strong>{secilenHizmet}</strong>
          </p>
        )}

        <label>Berber Seç</label>
        <select
          required
          value={secilenBerber}
          onChange={(e) => setSecilenBerber(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Berber seçin --</option>
          {berberler.map((b) => (
            <option key={b.id} value={b.id}>
              {b.isim || b.id}
            </option>
          ))}
        </select>

        <label>Tarih Seç</label>
        <input
          type="date"
          value={tarih}
          onChange={(e) => setTarih(e.target.value)}
          required
          className="border border-gray-300 p-2 rounded"
        />

        <label>Saat Seç</label>
        <input
          type="time"
          value={saat}
          onChange={(e) => setSaat(e.target.value)}
          required
          className="border border-gray-300 p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Randevuyu Onayla
        </button>
      </form>

      {modalAcik && <LoginModal onKapat={() => setModalAcik(false)} />}
    </div>
  );
}
