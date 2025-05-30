import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import KuaforKart from "../components/KuaforKart";

export default function Home() {
  const [kuaforler, setKuaforler] = useState([]);
  const [current, setCurrent] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const phrases = ["Özgür ol", "Cesur ol", "Fark yarat"];

  // Kategoriler burada
  const categories = [
    "Kuaför",
    "Berber",
    "Tırnak Salonu",
    "Cilt Bakımı",
    "Kaş ve Kirpik",
    "Masaj",
    "Makyaj",
    "Wellness & Gündüz Spa",
    "Dövme Salonu",
    "Estetik Tıp",
    "Lazer Epilasyon",
    "Ev Hizmetleri",
    "Piercing",
    "Evcil Hayvan Hizmetleri",
    "Diş & Ortodonti",
    "Sağlık & Fitness",
    "Profesyonel Hizmetler",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % phrases.length);
    }, 2500);

    const fetchKuaforler = async () => {
      const kuaforCol = collection(db, "kuaforler");
      const kuaforSnapshot = await getDocs(kuaforCol);
      const kuaforList = kuaforSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKuaforler(kuaforList);
    };

    fetchKuaforler();

    return () => clearInterval(interval);
  }, []);

  // Aramaya göre filtreleme
  const filteredKuaforler = kuaforler.filter((k) =>
    k.isim.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (k.hizmetler && k.hizmetler.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="pt-16">
      {/* Hero Banner with Video Background */}
      <div className="relative h-[600px] flex flex-col items-center justify-center text-white text-center px-4 overflow-hidden">
        {/* Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="https://res.cloudinary.com/dnaxg2gyx/video/upload/v1684740512/qsgdz5ypnywcenhthogy.mp4"
          type="video/mp4"
        />

        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>

        {/* Text and Input */}
        <div className="relative z-20 max-w-2xl mt-12">
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
            className="w-full px-4 py-2 rounded-full text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Kategori Butonları - Tam genişlik ve yayılmış */}
        <div className="relative z-20 flex overflow-x-auto gap-3 py-4 px-6 bg-transparent w-full max-w-full mt-auto justify-between flex-wrap">
          {categories.map((kat, i) => (
            <button
              key={i}
              className="flex-shrink-0 px-3 py-1 text-sm rounded-full bg-gray-100 bg-opacity-50 hover:bg-blue-600 hover:text-white transition backdrop-blur-sm min-w-[100px] text-center"
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      {/* Kuaför Kartları */}
      <div className="px-4 py-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white">
        {filteredKuaforler.length > 0 ? (
          filteredKuaforler.map((k) => <KuaforKart key={k.id} kuafor={k} />)
        ) : (
          <p>Kuaför bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
