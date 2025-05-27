// src/pages/Home.js
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Ana Sayfa - Kuaför Listesi</h1>
      <ul>
        <li>
          <Link to="/kuafor/1">Berber Kadir</Link>
        </li>
        <li>
          <Link to="/kuafor/2">Haircut Zone</Link>
        </li>
      </ul>
    </div>
  );
}
