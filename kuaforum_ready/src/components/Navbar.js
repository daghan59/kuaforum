import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [modalAcik, setModalAcik] = useState(false);
  const [kullanici, setKullanici] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setKullanici(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/");
    });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-md text-black px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Sol: Logo */}
          <h1 className="text-xl font-bold">Kuaförüm</h1>

          {/* Sağ: Menü */}
          <div className="flex items-center gap-4 text-sm">
            <Link to="/home" className="hover:underline">Ana Sayfa</Link>
            <Link to="/harita" className="hover:underline">Harita</Link>

            {kullanici && (
              <>
                <Link to="/benim-randevularim" className="hover:underline">
                  Randevularım
                </Link>

                {/* 📁 Kuaför Paneli Butonu */}
                {kullanici.email?.includes("daghan") && (
                  <Link
                    to={`/kuafor-panel/${kullanici.uid}`}
                    className="hover:underline bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    📁 Kuaför Paneli
                  </Link>
                )}
              </>
            )}

            {kullanici ? (
              <>
                <span className="text-blue-700 font-medium">
                  Merhaba {kullanici.displayName || kullanici.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-gray-100 rounded hover:bg-red-500 hover:text-white"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <button
                onClick={() => setModalAcik(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Giriş / Kayıt Ol
              </button>
            )}
          </div>
        </div>
      </nav>

      {modalAcik && <LoginModal onKapat={() => setModalAcik(false)} />}
    </>
  );
}
