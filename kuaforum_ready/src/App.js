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
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import 'leaflet/dist/leaflet.css';
import KuaforStore from "./pages/KuaforStore";
import KuaforEkle from "./pages/KuaforEkle";

// ...




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
        <Route path="/kuafor-store/:id" element={<KuaforStore />} />
        <Route path="/kuafor-ekle" element={<KuaforEkle />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;
