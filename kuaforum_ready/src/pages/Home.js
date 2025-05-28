import { useEffect, useState } from "react";
import KuaforKart from "../components/KuaforKart";

const kuaforler = [
  {
    id: "1",
    isim: "Berber Kadir",
    adres: "Çorlu, Şehitler Cd.",
    puan: 4.8,
    foto: "https://source.unsplash.com/featured/?barber"
  },
  {
    id: "2",
    isim: "Haircut Zone",
    adres: "Çorlu, Atatürk Mah.",
    puan: 4.5,
    foto: "https://source.unsplash.com/featured/?hairdresser"
  }
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const phrases = ["Özgür ol", "Cesur ol", "Fark yarat"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Banner */}
      <div
        className="h-[400px] bg-cover bg-center flex flex-col items-center justify-center text-white text-center px-4"
        style={{
          backgroundImage: "url('https://source.unsplash.com/featured/?barbershop')"
        }}
      >
        {/* Kayan yazı kutusu */}
        <div className="h-14 flex items-center justify-center">
          <div className="px-4 py-1 rounded bg-black/40 text-white text-4xl font-bold animate-fade-slide shadow-md">
            {phrases[current]}
          </div>
        </div>

        <p className="mb-4 text-lg mt-2">
          Yakınındaki güzellik ve bakım profesyonellerini keşfet
        </p>

        <input
          type="text"
          placeholder="Hizmet veya işletme ara"
          className="w-full max-w-md px-4 py-2 rounded-full text-black"
        />
      </div>

      {/* Kategori Butonları */}
      <div className="flex overflow-x-auto gap-4 py-4 px-4 bg-white shadow">
        {["Kuaför", "Berber", "Cilt Bakımı", "Masaj", "Makyaj"].map((kat, i) => (
          <button
            key={i}
            className="flex-shrink-0 px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white transition"
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Kuaför Kartları */}
      <div className="px-4 py-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {kuaforler.map((k) => (
          <KuaforKart key={k.id} kuafor={k} />
        ))}
      </div>

      {/* Recommended Slider */}
      <h2 className="text-xl font-semibold px-4 mt-6 mb-2">Önerilenler</h2>
      <div className="overflow-x-auto flex gap-4 px-4 pb-6">
        {[1, 2, 3, 4].map((k) => (
          <div
            key={k}
            className="min-w-[200px] bg-white shadow rounded overflow-hidden"
          >
            <img
              src={`https://source.unsplash.com/featured/?barber,${k}`}
              alt="kuafor"
              className="h-32 w-full object-cover"
            />
            <div className="p-2">
              <h3 className="text-sm font-bold">Krispi King {k}</h3>
              <p className="text-xs text-gray-500">Çorlu, Tekirdağ</p>
              <span className="text-yellow-500 text-sm">⭐ 5.0</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
