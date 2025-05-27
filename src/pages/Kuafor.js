// src/pages/Kuafor.js
import { useParams, useNavigate } from "react-router-dom";

export default function Kuafor() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Kuaför Detay Sayfası (ID: {id})</h1>
      <button onClick={() => navigate(`/randevu/${id}`)}>
        Randevu Al
      </button>
    </div>
  );
}
