import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRegion } from "../services/regionService";

export default function AddRegion() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name.trim()) return "El nombre es obligatorio.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setSaving(true);
    setError("");

    try {
      await createRegion(form);
      navigate("/regions");
    } catch (err) {
      setError("Error al guardar: " + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fruit-container">
      <h1 className="fruit-title">Agregar Región</h1>

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
          <label>Nombre *</label>
          <input
            type="text"
            name="name"
            placeholder="Ej: Selva amazónica"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Descripción</label>
          <textarea
            name="description"
            placeholder="Descripción de la región"
            value={form.description}
            onChange={handleChange}
            rows={5}
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
            onClick={() => navigate("/regions")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
