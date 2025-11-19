import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFruitById, getFruitRecipes } from "../services/fruitService";

export default function FruitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fruit, setFruit] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFruit();
  }, [id]);

  const loadFruit = async () => {
    try {
      setLoading(true);
      const [fruitData, recipesData] = await Promise.all([
        getFruitById(id),
        getFruitRecipes(id).catch(() => ({ recipes: [] }))
      ]);

      setFruit(fruitData.fruit);
      setRecipes(recipesData.recipes || []);
    } catch (err) {
      setError("Error al cargar la fruta: " + err.message);
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
        <button className="btn" onClick={() => navigate("/fruits")}>
          Volver a la lista
        </button>
      </div>
    );
  }

  if (!fruit) {
    return (
      <div className="fruit-container">
        <p>Fruta no encontrada</p>
        <button className="btn" onClick={() => navigate("/fruits")}>
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="fruit-container">
      <button
        className="btn"
        onClick={() => navigate("/fruits")}
        style={{ marginBottom: "20px" }}
      >
        ← Volver
      </button>

      <div className="fruit-detail-card">
        {fruit.image_url && (
          <img
            src={fruit.image_url}
            alt={fruit.common_name}
            className="fruit-detail-img"
          />
        )}

        <h1 className="fruit-title">{fruit.common_name}</h1>

        {fruit.scientific_name && (
          <p className="fruit-scientific">
            <em>{fruit.scientific_name}</em>
          </p>
        )}

        {fruit.description && (
          <div className="fruit-description">
            <h3>Descripción</h3>
            <p>{fruit.description}</p>
          </div>
        )}

        {recipes.length > 0 && (
          <div className="fruit-recipes-section">
            <h3>🍳 Recetas relacionadas</h3>
            <div className="recipes-grid">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="recipe-card"
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                >
                  <h4>{recipe.name}</h4>
                  {recipe.description && (
                    <p className="recipe-description">{recipe.description}</p>
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
