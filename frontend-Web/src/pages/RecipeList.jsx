import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getRecipes } from "../services/recipeService";
import { AuthContext } from "../context/AuthContext";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await getRecipes();
      setRecipes(data.recipes || []);
    } catch (err) {
      setError("Error al cargar recetas: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fruit-container">
        <p>Cargando recetas...</p>
      </div>
    );
  }

  return (
    <div className="fruit-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="fruit-title">🍳 Recetas</h1>
        {token && (
          <button className="add-btn" onClick={() => navigate("/recipes/add")}>
            ➕ Agregar Receta
          </button>
        )}
      </div>

      {error && (
        <p style={{ color: "var(--danger)" }}>{error}</p>
      )}

      <div className="fruit-grid">
        {recipes.length === 0 ? (
          <p>No hay recetas disponibles</p>
        ) : (
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="fruit-card"
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h2>{recipe.title}</h2>
              {recipe.description && (
                <p style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                  {recipe.description.substring(0, 100)}
                  {recipe.description.length > 100 ? "..." : ""}
                </p>
              )}
              <button className="btn" style={{ marginTop: "10px" }}>
                Ver receta →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
