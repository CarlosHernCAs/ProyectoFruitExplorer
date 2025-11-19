import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../services/recipeService";

export default function AddRecipe() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    source: "",
    image_url: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.title.trim()) return "El título es obligatorio.";
    if (!form.description.trim()) return "La descripción es obligatoria.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setSaving(true);
    setError("");

    try {
      await createRecipe(form);
      navigate("/recipes");
    } catch (err) {
      setError("Error al guardar: " + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fruit-container">
      <h1 className="fruit-title">Agregar Receta</h1>

      <form onSubmit={handleSubmit} className="fruit-form">
        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              padding: "10px 12px",
              borderRadius: 8,
              marginBottom: 14,
            }}
          >
            {error}
          </div>
        )}

        <div className="input-group">
          <label>Título *</label>
          <input
            type="text"
            name="title"
            placeholder="Ej: Tarta de manzana"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Descripción *</label>
          <textarea
            name="description"
            placeholder="Descripción breve de la receta"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
          />
        </div>

        <div className="input-group">
          <label>Fuente</label>
          <input
            type="text"
            name="source"
            placeholder="Ej: Receta familiar, sitio web, etc."
            value={form.source}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>URL de imagen</label>
          <input
            type="text"
            name="image_url"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={form.image_url}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button
            type="submit"
            className="btn"
            disabled={saving}
            style={{ minWidth: 120 }}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>

          <button
            type="button"
            className="btn"
            style={{ backgroundColor: "#6b7280", minWidth: 120 }}
            onClick={() => navigate("/recipes")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
