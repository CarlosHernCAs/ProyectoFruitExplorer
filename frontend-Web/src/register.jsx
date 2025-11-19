import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 👇 usamos los nombres correctos que el backend espera
        body: JSON.stringify({
          username: displayName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error al registrar ❌");
        return;
      }

      setMessage(data.message || "Registro exitoso ✅");

      if (data.token) {
        // ✔ Usar el contexto para guardar la sesión
        login(data.token, data.user);
        // ✔ Redirigir sin recargar la página
        navigate("/home", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setMessage("Error de conexión con el servidor ❌");
    }
  };

  return (
    <div className="section">
      <h2>Registro 🍓</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
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
        <button type="submit">Registrarse</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
