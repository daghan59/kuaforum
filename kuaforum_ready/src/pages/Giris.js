import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Giris() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      console.error("Giriş hatası:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Google ile Giriş Yap</h2>
      <button onClick={handleLogin}>Giriş</button>
    </div>
  );
}
