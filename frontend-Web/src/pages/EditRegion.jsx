import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRegionById, updateRegion } from "../services/regionService";

export default function EditRegion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRegion();
  }, [id]);

  const loadRegion = async () => {
    try {
      setLoading(true);
      const data = await getRegionById(id);
      setForm(data.region);
    } catch (err) {
      setError("Error al cargar la región: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      await updateRegion(id, form);
      navigate("/regions");
    } catch (err) {
      setError("Error al actualizar: " + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fruit-container">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="fruit-container">
        <p>Región no encontrada</p>
        <button className="btn" onClick={() => navigate("/regions")}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="fruit-container">
      <h1 className="fruit-title">Editar Región</h1>

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
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description || ""}
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
