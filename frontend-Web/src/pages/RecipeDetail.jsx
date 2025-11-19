import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById } from "../services/recipeService";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const data = await getRecipeById(id);
      setRecipe(data.receta);
    } catch (err) {
      setError("Error al cargar la receta: " + err.message);
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
        <button className="btn" onClick={() => navigate("/recipes")}>
          Volver a recetas
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="fruit-container">
        <p>Receta no encontrada</p>
        <button className="btn" onClick={() => navigate("/recipes")}>
          Volver a recetas
        </button>
      </div>
    );
  }

  return (
    <div className="fruit-container">
      <button
        className="btn"
        onClick={() => navigate("/recipes")}
        style={{ marginBottom: "20px" }}
      >
        ← Volver
      </button>

      <div className="fruit-detail-card">
        <h1 className="fruit-title">{recipe.name}</h1>

        {recipe.description && (
          <div className="fruit-description">
            <h3>Descripción</h3>
            <p>{recipe.description}</p>
          </div>
        )}

        {recipe.ingredients && (
          <div className="fruit-description">
            <h3>Ingredientes</h3>
            <p style={{ whiteSpace: "pre-line" }}>{recipe.ingredients}</p>
          </div>
        )}

        {recipe.instructions && (
          <div className="fruit-description">
            <h3>Instrucciones</h3>
            <p style={{ whiteSpace: "pre-line" }}>{recipe.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
}
