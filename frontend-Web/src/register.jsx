import { useState } from "react";

export default function Register() {
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
        body: JSON.stringify({ email, password, display_name: displayName }),
      });

      const data = await res.json();
      setMessage(data.mensaje || "Registro exitoso ✅");

      // Guarda el token en localStorage para futuras peticiones
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

    } catch (err) {
      console.error(err);
      setMessage("Error al registrar ❌");
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre para mostrar"
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
      <p>{message}</p>
    </div>
  );
}
