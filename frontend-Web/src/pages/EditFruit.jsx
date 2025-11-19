// pages/EditFruit.jsx
import { useEffect, useState } from "react";
import { getFruitById, updateFruit } from "../services/fruitService";
import { useParams, useNavigate } from "react-router-dom";

export default function EditFruit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFruitById(id);
        setForm(data.fruit);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const validate = () => {
    if (!form.slug.trim()) return "El campo slug es obligatorio.";
    if (!form.common_name.trim()) return "El nombre común es obligatorio.";
    return "";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setSaving(true);
    setError("");

    try {
      await updateFruit(id, form);
      navigate("/home?updated=1");
    } catch (err) {
      console.error(err);
      setError("Error al actualizar la información.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fruit-container">
        <p style={{ fontSize: "1rem", opacity: 0.7 }}>Cargando datos...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="fruit-container">
        <p>No se encontró información para esta fruta.</p>
      </div>
    );
  }

  return (
    <div className="fruit-container">
      <h1 className="fruit-title">Editar Fruta</h1>

      <form onSubmit={handleSubmit} className="fruit-form">
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
          <input type="text" name="slug" value={form.slug} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Nombre común</label>
          <input
            type="text"
            name="common_name"
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
            value={form.scientific_name}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>URL de imagen</label>
          <input
            type="text"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button type="submit" className="btn" disabled={saving} style={{ minWidth: 140 }}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            type="button"
            className="btn"
            style={{ backgroundColor: "#6b7280", minWidth: 140 }}
            onClick={() => navigate("/home")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
