import { useState } from "react";
import { auth, provider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";

export default function LoginModal({ onKapat }) {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [yeniKullanici, setYeniKullanici] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (yeniKullanici) {
        await createUserWithEmailAndPassword(auth, email, sifre);
        alert("Kayıt başarılı!");
      } else {
        await signInWithEmailAndPassword(auth, email, sifre);
        alert("Giriş başarılı!");
      }
      onKapat();
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Google ile giriş başarılı!");
      onKapat();
    } catch (err) {
      alert("Google hatası: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow">
        {/* Çarpı Butonu */}
        <button
          onClick={onKapat}
          className="absolute top-2 right-3 text-gray-600 text-2xl hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">{yeniKullanici ? "Kayıt Ol" : "Giriş Yap"}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {yeniKullanici ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </form>

        <button
          onClick={handleGoogle}
          className="w-full mt-3 bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Google ile Giriş Yap
        </button>

        <p className="mt-3 text-sm text-center">
          {yeniKullanici ? "Zaten hesabın var mı?" : "Hesabın yok mu?"}{" "}
          <button className="text-blue-600 underline" onClick={() => setYeniKullanici(!yeniKullanici)}>
            {yeniKullanici ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </p>
      </div>
    </div>
  );
}
