import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import LoginModal from "./LoginModal";

export default function KuaforKart({ kuafor }) {
  const navigate = useNavigate();
  const [modalAcik, setModalAcik] = useState(false);

  // Resim için fallback: önce kuafor.foto, sonra fotograflar dizisinden ilk foto, yoksa placeholder
  const fotoURL = kuafor.foto || kuafor.fotograflar?.[0] || "https://via.placeholder.com/300x160?text=Resim+Yok";

  return (
    <div className="border rounded shadow p-4">
      {/* Kartın kendisi tıklanabilir, profil sayfasına götürür */}
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/kuafor-store/${kuafor.id}`)}
      >
        <img
          src={fotoURL}
          alt={kuafor.isim}
          className="w-full h-40 object-cover rounded"
        />
        <h3 className="mt-2 font-bold">{kuafor.isim}</h3>
        <p className="text-yellow-500">⭐ {kuafor.puan}</p>
      </div>

      {/* Randevu Al butonu ayrı */}
      <button
        onClick={() => {
          if (!auth.currentUser) {
            setModalAcik(true);
          } else {
            navigate(`/randevu/${kuafor.id}`);
          }
        }}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Randevu Al
      </button>

      {/* Giriş modalı */}
      {modalAcik && <LoginModal onKapat={() => setModalAcik(false)} />}
    </div>
  );
}
