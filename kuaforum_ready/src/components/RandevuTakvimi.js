import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function RandevuTakvimi({ randevular }) {
  const [seciliRandevu, setSeciliRandevu] = useState(null);

  // Firebase'den gelen randevuları react-big-calendar event formatına çevir
  const events = randevular.map((r) => {
    const start = moment(r.tarih + " " + r.saat, "YYYY-MM-DD HH:mm").toDate();
    const end = moment(start).add(30, "minutes").toDate();

    return {
      id: r.id,
      title: `${r.hizmetAdi || "Randevu"} - ${r.kullaniciAdi || "Müşteri"}`,
      start,
      end,
      bgColor: r.durum === "Onaylandı" ? "green" : "orange",
      randevuData: r,
      allDay: false,
    };
  });

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.bgColor || "orange",
      color: "white",
      borderRadius: "5px",
      border: "none",
      padding: "2px",
      cursor: "pointer",
    },
  });

  return (
    <>
      <div style={{ height: "600px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={["week"]}
          step={30}
          timeslots={1}
          defaultDate={new Date()}
          style={{ height: "100%" }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => setSeciliRandevu(event.randevuData)}
        />
      </div>

      {seciliRandevu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 max-w-md w-full shadow-lg relative">
            <button
              onClick={() => setSeciliRandevu(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              aria-label="Kapat"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Randevu Detayları</h2>
            <p><strong>Tarih:</strong> {seciliRandevu.tarih}</p>
            <p><strong>Saat:</strong> {seciliRandevu.saat}</p>
            <p><strong>Müşteri:</strong> {seciliRandevu.kullaniciAdi}</p>
            <p><strong>Email:</strong> {seciliRandevu.email}</p>
            <p><strong>Hizmet:</strong> {seciliRandevu.hizmetAdi}</p>
            <p><strong>Durum:</strong> {seciliRandevu.durum}</p>
          </div>
        </div>
      )}
    </>
  );
}
