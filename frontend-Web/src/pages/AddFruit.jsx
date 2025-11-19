// pages/AddFruit.jsx
import { useState } from "react";
import { createFruit } from "../services/fruitService";
import { useNavigate } from "react-router-dom";

export default function AddFruit() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    slug: "",
    common_name: "",
    scientific_name: "",
    description: "",
    image_url: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.slug.trim()) return "El campo slug es obligatorio.";
    if (!form.common_name.trim()) return "El nombre común es obligatorio.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setSaving(true);
    setError("");

    try {
      await createFruit(form);
      navigate("/home?created=1"); // más profesional que un alert
    } catch (err) {
      setError("Error al guardar. Intenta nuevamente.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fruit-container">
      <h1 className="fruit-title">Agregar Fruta</h1>

      <form onSubmit={handleSubmit} className="fruit-form" aria-live="polite">
        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              padding: "10px 12px",
              borderRadius: 8,
              marginBottom: 14,
              fontSize: "0.9rem",
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="input-group">
          <label>Slug</label>
          <input
            type="text"
            name="slug"
            placeholder="ej: mango-peruano"
            value={form.slug}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Nombre común</label>
          <input
            type="text"
            name="common_name"
            placeholder="Nombre común"
            value={form.common_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Nombre científico</label>
          <input
            type="text"
            name="scientific_name"
            placeholder="Nombre científico"
            value={form.scientific_name}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Descripción</label>
          <textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>URL de imagen</label>
          <input
            type="text"
            name="image_url"
            placeholder="https://..."
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
            style={{
              backgroundColor: "#6b7280",
              minWidth: 120,
            }}
            onClick={() => navigate("/home")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
