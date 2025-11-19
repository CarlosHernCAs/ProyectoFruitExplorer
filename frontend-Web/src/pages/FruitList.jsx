// pages/FruitList.jsx
import { useEffect, useState } from "react";
import { getFruits } from "../services/fruitService";

export default function FruitList() {
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFruits()
      .then((data) => setFruits(data.frutas || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fruit-container">
      <div className="fruit-header">
        <h1 className="fruit-title">Catálogo de Frutas</h1>
        <p className="fruit-subtitle">
          Consulta el listado completo de frutas disponibles en el sistema.
        </p>
      </div>

      {loading ? (
        <p style={{ opacity: 0.7 }}>Cargando información...</p>
      ) : fruits.length === 0 ? (
        <p>No hay frutas registradas.</p>
      ) : (
        <div className="fruit-grid">
          {fruits.map((f) => (
            <div key={f.id} className="fruit-card">
              <div className="fruit-img-wrapper">
                <img
                  src={f.image_url || "https://via.placeholder.com/200"}
                  alt={f.common_name}
                  className="fruit-img"
                />
              </div>

              <div className="fruit-card-body">
                <h3 className="fruit-name">{f.common_name}</h3>
                <p className="fruit-scientific">{f.scientific_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
