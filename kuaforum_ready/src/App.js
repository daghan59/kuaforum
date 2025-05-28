import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Kuafor from "./pages/Kuafor";
import Randevu from "./pages/Randevu";
import BenimRandevularim from "./pages/BenimRandevularim";
import KuaforPanel from "./pages/KuaforPanel";
import Harita from "./pages/Harita";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import KuaforProfil from "./pages/KuaforProfil";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/kuafor/:id" element={<Kuafor />} />
        <Route path="/randevu/:id" element={<Randevu />} />
        <Route path="/benim-randevularim" element={<BenimRandevularim />} />
        <Route path="/kuafor-panel/:id" element={<KuaforPanel />} />
        <Route path="/harita" element={<Harita />} />
        <Route path="/kuafor-profil/:id" element={<KuaforProfil />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;
