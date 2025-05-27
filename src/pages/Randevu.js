import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function Randevu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tarih, setTarih] = useState("");
  const [saat, setSaat] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "randevular"), {
        kuaforId: id,
        tarih,
        saat,
        olusturmaZamani: Timestamp.now()
      });

      alert("Randevunuz oluşturuldu!");
      navigate("/home");
    } catch (err) {
      console.error("HATA:", err);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Randevu Al - Kuaför ID: {id}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={tarih}
          onChange={(e) => setTarih(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="time"
          value={saat}
          onChange={(e) => setSaat(e.target.value)}
          required
        />
        <br /><br />
        <button>Randevuyu Onayla</button>
      </form>
    </div>
  );
}
