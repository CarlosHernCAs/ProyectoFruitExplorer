import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getRegions } from "../services/regionService";
import { AuthContext } from "../context/AuthContext";

export default function RegionList() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      setLoading(true);
      const data = await getRegions();
      setRegions(data.regiones || []);
    } catch (err) {
      setError("Error al cargar regiones: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fruit-container">
        <p>Cargando regiones...</p>
      </div>
    );
  }

  return (
    <div className="fruit-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="fruit-title">🌍 Regiones</h1>
        {token && (
          <button className="add-btn" onClick={() => navigate("/regions/add")}>
            ➕ Agregar Región
          </button>
        )}
      </div>

      {error && (
        <p style={{ color: "var(--danger)" }}>{error}</p>
      )}

      <div className="fruit-grid">
        {regions.length === 0 ? (
          <p>No hay regiones disponibles</p>
        ) : (
          regions.map((region) => (
            <div
              key={region.id}
              className="fruit-card"
              onClick={() => navigate(`/regions/${region.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h2>{region.name}</h2>
              {region.description && (
                <p style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                  {region.description.substring(0, 100)}
                  {region.description.length > 100 ? "..." : ""}
                </p>
              )}
              <button className="btn" style={{ marginTop: "10px" }}>
                Ver región →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
