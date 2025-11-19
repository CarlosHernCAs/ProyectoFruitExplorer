import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRegionById, getRegionFruits } from "../services/regionService";

export default function RegionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [region, setRegion] = useState(null);
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRegion();
  }, [id]);

  const loadRegion = async () => {
    try {
      setLoading(true);
      const [regionData, fruitsData] = await Promise.all([
        getRegionById(id),
        getRegionFruits(id).catch(() => ({ frutas: [] }))
      ]);

      setRegion(regionData.region);
      setFruits(fruitsData.frutas || []);
    } catch (err) {
      setError("Error al cargar la región: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fruit-container">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fruit-container">
        <p style={{ color: "var(--danger)" }}>{error}</p>
        <button className="btn" onClick={() => navigate("/regions")}>
          Volver a regiones
        </button>
      </div>
    );
  }

  if (!region) {
    return (
      <div className="fruit-container">
        <p>Región no encontrada</p>
        <button className="btn" onClick={() => navigate("/regions")}>
          Volver a regiones
        </button>
      </div>
    );
  }

  return (
    <div className="fruit-container">
      <button
        className="btn"
        onClick={() => navigate("/regions")}
        style={{ marginBottom: "20px" }}
      >
        ← Volver
      </button>

      <div className="fruit-detail-card">
        <h1 className="fruit-title">{region.name}</h1>

        {region.description && (
          <div className="fruit-description">
            <h3>Descripción</h3>
            <p>{region.description}</p>
          </div>
        )}

        {fruits.length > 0 && (
          <div className="fruit-recipes-section">
            <h3>🍎 Frutas de esta región</h3>
            <div className="recipes-grid">
              {fruits.map((fruit) => (
                <div
                  key={fruit.id}
                  className="recipe-card"
                  onClick={() => navigate(`/fruits/${fruit.id}`)}
                >
                  {fruit.image_url && (
                    <img
                      src={fruit.image_url}
                      alt={fruit.common_name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px"
                      }}
                    />
                  )}
                  <h4>{fruit.common_name}</h4>
                  {fruit.scientific_name && (
                    <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "var(--text-light)" }}>
                      {fruit.scientific_name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
