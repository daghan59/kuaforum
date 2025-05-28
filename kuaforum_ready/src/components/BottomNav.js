import { NavLink } from "react-router-dom";
import { Home, MapPin, Calendar, User } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2 z-50">
      <NavLink to="/home" className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600">
        <Home size={20} />
        <span>Ana Sayfa</span>
      </NavLink>
      <NavLink to="/harita" className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600">
        <MapPin size={20} />
        <span>Harita</span>
      </NavLink>
      <NavLink to="/benim-randevularim" className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600">
        <Calendar size={20} />
        <span>Randevular</span>
      </NavLink>
      <NavLink to="/profil" className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600">
        <User size={20} />
        <span>Profil</span>
      </NavLink>
    </div>
  );
}
