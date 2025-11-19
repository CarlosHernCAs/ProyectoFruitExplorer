import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getFruits, deleteFruit } from "./services/fruitService";

export default function Home() {
  const [fruits, setFruits] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadFruits();
  }, []);

  const loadFruits = async () => {
    const data = await getFruits();
    setFruits(data.fruits || []);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta fruta?")) return;

    try {
      await deleteFruit(id);
      loadFruits(); // recargar lista
    } catch (err) {
      alert("Error al eliminar fruta");
      console.error(err);
    }
  };

  return (
    <div className="fruit-container">
      <h1 className="fruit-title">Panel de Administración 🍍</h1>

      <button className="add-btn" onClick={() => navigate("/fruits/add")}>
        ➕ Agregar Fruta
      </button>

      <div className="fruit-grid">
        {fruits.map((f) => (
          <div key={f.id} className="fruit-card">
            <img
              src={f.image_url}
              className="fruit-img"
              alt={f.common_name}
              onClick={() => navigate(`/fruits/edit/${f.id}`)}
            />

            <h2>{f.common_name}</h2>
            <p>{f.scientific_name}</p>

            {/* botones */}
            <button
              className="edit-btn"
              onClick={() => navigate(`/fruits/edit/${f.id}`)}
            >
              ✏️ Editar
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDelete(f.id)}
            >
              🗑️ Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
