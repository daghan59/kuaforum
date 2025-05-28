import { Link } from "react-router-dom";

export default function KuaforKart({ kuafor }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition">
      <img
        src={kuafor.foto}
        alt={kuafor.isim}
        className="w-full h-40 object-cover rounded-t-xl"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold">{kuafor.isim}</h2>
        <p className="text-sm text-gray-500">{kuafor.adres}</p>
        <p className="text-yellow-500 text-sm">⭐ {kuafor.puan}</p>
        <Link
          to={`/kuafor/${kuafor.id}`}
          className="mt-2 inline-block text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Randevu Al
        </Link>
      </div>
    </div>
  );
}
