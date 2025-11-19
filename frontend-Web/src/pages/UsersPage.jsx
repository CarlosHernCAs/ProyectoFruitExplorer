import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllUsers, registerUser, deleteUser, updateUserRole } from "../services/userService";
import { Users, UserPlus, Trash2, Shield, User, Mail, Calendar, Clock, Edit } from "lucide-react";
import "../styles/users.css";

export default function UsersPage() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data.usuarios);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setMessage({
        text: "Error al cargar usuarios: " + err.message,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!form.username || !form.email || !form.password) {
      setMessage({
        text: "Por favor completa todos los campos",
        type: "error"
      });
      return;
    }

    try {
      await registerUser({
        email: form.email,
        password: form.password,
        display_name: form.username
      });
      setMessage({
        text: "Usuario creado correctamente",
        type: "success"
      });
      setForm({ username: "", email: "", password: "" });
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setMessage({
        text: "Error al crear usuario: " + err.message,
        type: "error"
      });
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) {
      return;
    }

    setDeleting(userId);
    try {
      await deleteUser(userId);
      setMessage({
        text: "Usuario eliminado correctamente",
        type: "success"
      });
      loadUsers();
    } catch (err) {
      setMessage({
        text: "Error al eliminar usuario: " + err.message,
        type: "error"
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingRole(userId);
    try {
      await updateUserRole(userId, newRole);
      setMessage({
        text: "Rol actualizado correctamente",
        type: "success"
      });
      loadUsers();
    } catch (err) {
      setMessage({
        text: "Error al actualizar rol: " + err.message,
        type: "error"
      });
    } finally {
      setUpdatingRole(null);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: "#7c3aed", icon: Shield, label: "Administrador" },
      editor: { color: "#3b82f6", icon: User, label: "Editor" },
      user: { color: "#10b981", icon: User, label: "Usuario" }
    };

    const badge = badges[role] || badges.user;
    const Icon = badge.icon;

    return (
      <div
        className="role-badge"
        style={{ backgroundColor: badge.color + '20', color: badge.color }}
      >
        <Icon size={14} />
        <span>{badge.label}</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="users-page">
      {/* Header */}
      <div className="users-header">
        <div className="users-header-content">
          <div className="users-header-title">
            <Users size={32} />
            <h1>Gestión de Usuarios</h1>
          </div>
          <button
            className="btn-add-user"
            onClick={() => setShowForm(!showForm)}
          >
            <UserPlus size={20} />
            <span>Nuevo Usuario</span>
          </button>
        </div>

        {/* Stats */}
        <div className="users-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#7c3aed20', color: '#7c3aed' }}>
              <Shield size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Administradores</p>
              <p className="stat-value">{users.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
              <User size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Editores</p>
              <p className="stat-value">{users.filter(u => u.role === 'editor').length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
              <Users size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Usuarios</p>
              <p className="stat-value">{users.filter(u => u.role === 'user' || !u.role).length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
              <Users size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total</p>
              <p className="stat-value">{users.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {message.text && (
        <div className={`message message-${message.type}`}>
          <div className="message-content">
            <span>{message.text}</span>
            <button onClick={() => setMessage({ text: "", type: "" })}>×</button>
          </div>
        </div>
      )}

      {/* Formulario de Nuevo Usuario */}
      {showForm && (
        <div className="users-form-card">
          <div className="form-header">
            <h2>Registrar Nuevo Usuario</h2>
            <button onClick={() => setShowForm(false)} className="btn-close">×</button>
          </div>

          <form onSubmit={handleSubmit} className="users-form">
            <div className="form-group">
              <label>
                <User size={18} />
                <span>Nombre completo</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Mail size={18} />
                <span>Correo electrónico</span>
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Shield size={18} />
                <span>Contraseña</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="btn-submit">
                <UserPlus size={18} />
                Crear Usuario
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Usuarios */}
      <div className="users-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <Users size={64} />
            <h3>No hay usuarios registrados</h3>
            <p>Comienza agregando tu primer usuario</p>
          </div>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar">
                    {user.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h3>{user.display_name || "Sin nombre"}</h3>
                    <p className="user-email">
                      <Mail size={14} />
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="user-card-body">
                  <div className="user-meta">
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>Creado: {formatDate(user.created_at)}</span>
                    </div>
                    {user.last_login && (
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>Último acceso: {formatDate(user.last_login)}</span>
                      </div>
                    )}
                  </div>

                  {/* Selector de Rol */}
                  <div className="role-selector">
                    <label>
                      <Shield size={14} />
                      <span>Rol:</span>
                    </label>
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={updatingRole === user.id}
                      className="role-select"
                    >
                      <option value="user">Usuario</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Administrador</option>
                    </select>
                    {updatingRole === user.id && (
                      <div className="spinner-small"></div>
                    )}
                  </div>
                </div>

                <div className="user-card-footer">
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(user.id)}
                    disabled={deleting === user.id}
                  >
                    {deleting === user.id ? (
                      <>
                        <div className="spinner-small"></div>
                        <span>Eliminando...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        <span>Eliminar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
