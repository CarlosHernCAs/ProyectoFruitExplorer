import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/apiFetch";

export default function UsersPage() {
  const { token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

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
      const data = await apiFetch("/users");
      setUsers(data.usuarios);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setMessage("Usuario creado correctamente ✓");
      setForm({ username: "", email: "", password: "" });
      loadUsers();
    } catch (err) {
      setMessage("Error al crear usuario: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        👥 Gestión de Usuarios
      </h1>

      {/* LISTA */}
      <div className="users-table-wrapper">
        <table className="users-table mb-6">
          <thead>
            <tr style={{ background: "#eee" }}>
              <th className="border p-2">ID</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Correo</th>
              <th className="border p-2">Rol</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.id}</td>
                <td className="border p-2">{u.display_name}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.role || "Sin rol"}</td>
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

        {message && (
          <p className="mt-3 text-center text-sm text-purple-700">{message}</p>
        )}
      </div>
    </div>
  );
}
