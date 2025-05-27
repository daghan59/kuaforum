import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Kuafor from "./pages/Kuafor";
import Randevu from "./pages/Randevu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kuafor/:id" element={<Kuafor />} />
        <Route path="/randevu/:id" element={<Randevu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
