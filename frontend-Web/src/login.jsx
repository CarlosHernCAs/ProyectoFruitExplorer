import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🔍 Respuesta del servidor:", data);

      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión ❌");
      }

      // ✔ Guardar en contexto: token + usuario (esto ya guarda en localStorage)
      login(data.token, data.user);

      // ✔ Redirigir a inicio (sin recargar la página)
      navigate("/", { replace: true });
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <h2>Iniciar Sesión 🍍</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </section>
  );
}
