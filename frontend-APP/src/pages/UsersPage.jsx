import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllUsers, registerUser, deleteUser } from "../services/userService";

export default function UsersPage() {
  const { token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [deleting, setDeleting] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.usuarios);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setMessage("Error al cargar usuarios: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await registerUser(form);
      setMessage("✅ Usuario creado correctamente");
      setForm({ username: "", email: "", password: "" });
      loadUsers();
    } catch (err) {
      setMessage("❌ Error al crear usuario: " + err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) {
      return;
    }

    setDeleting(userId);
    try {
      await deleteUser(userId);
      setMessage("✅ Usuario eliminado correctamente");
      loadUsers();
    } catch (err) {
      setMessage("❌ Error al eliminar usuario: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        👥 Gestión de Usuarios
      </h1>

      {/* LISTA */}
      {message && (
        <div
          style={{
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            backgroundColor: message.startsWith("✅") ? "#d4edda" : "#f8d7da",
            color: message.startsWith("✅") ? "#155724" : "#721c24",
          }}
        >
          {message}
        </div>
      )}

      <div className="users-table-wrapper">
        <table className="users-table mb-6">
          <thead>
            <tr style={{ background: "#eee" }}>
              <th className="border p-2">ID</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Correo</th>
              <th className="border p-2">Rol</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.id}</td>
                <td className="border p-2">{u.display_name}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.role || "Sin rol"}</td>
                <td className="border p-2" style={{ textAlign: "center" }}>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(u.id)}
                    disabled={deleting === u.id}
                    style={{
                      padding: "6px 12px",
                      fontSize: "0.85rem",
                      backgroundColor: deleting === u.id ? "#ccc" : undefined,
                    }}
                  >
                    {deleting === u.id ? "Eliminando..." : "🗑️ Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORMULARIO */}
      <div className="bg-white p-4 rounded-xl shadow-md w-80">
        <h3 className="text-lg font-bold mb-3">Registrar nuevo usuario</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />

          <input
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded mb-3"
          />

          <button className="w-full bg-purple-600 text-white py-2 rounded">
            Crear Usuario
          </button>
       

          <button className="logout-btn mt-4" onClick={logout}>
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
