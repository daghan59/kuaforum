import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function RandevuListesi() {
  const [randevular, setRandevular] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "randevular"));
      const veriler = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRandevular(veriler);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Tüm Randevular</h1>
      <ul>
        {randevular.map((r) => (
          <li key={r.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc" }}>
            <strong>Kuaför ID:</strong> {r.kuaforId} <br />
            <strong>Tarih:</strong> {r.tarih} <br />
            <strong>Saat:</strong> {r.saat}
          </li>
        ))}
      </ul>
    </div>
  );
}
