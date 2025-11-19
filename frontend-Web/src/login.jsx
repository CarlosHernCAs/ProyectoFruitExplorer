import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Input from "./components/ui/Input";
import Button from "./components/ui/Button";
import { Card, CardBody } from "./components/ui/Card";
import { Mail, Lock, LogIn, Apple } from "lucide-react";
import "./styles/auth.css";

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
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // ✔ Guardar en contexto: token + usuario (esto ya guarda en localStorage)
      // El backend envía "usuario", no "user"
      login(data.token, data.usuario);

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
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Column - Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {/* Logo */}
            <div className="auth-logo">
              <Apple size={40} className="auth-logo-icon" />
              <h1 className="auth-logo-text">FruitExplorer</h1>
            </div>

            {/* Welcome Text */}
            <div className="auth-header">
              <h2 className="auth-title">Bienvenido de nuevo</h2>
              <p className="auth-subtitle">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            {/* Form Card */}
            <Card variant="default" padding="lg">
              <CardBody>
                <form onSubmit={handleSubmit} className="auth-form">
                  <Input
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    placeholder="tu@email.com"
                    required
                    error={error && error.includes("correo") ? error : ""}
                  />

                  <Input
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                    placeholder="••••••••"
                    required
                    error={error && !error.includes("correo") ? error : ""}
                  />

                  {error && (
                    <div className="auth-error">
                      <p>{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    icon={LogIn}
                    iconPosition="right"
                  >
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </CardBody>
            </Card>

            {/* Footer Links */}
            <div className="auth-footer">
              <p className="auth-footer-text">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="auth-link">
                  Regístrate aquí
                </Link>
              </p>
              <Link to="/" className="auth-link-secondary">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Illustration */}
        <div className="auth-illustration-section">
          <div className="auth-illustration-content">
            <div className="auth-illustration-icon">
              <Apple size={120} strokeWidth={1.5} />
            </div>
            <h3 className="auth-illustration-title">
              Descubre el mundo de las frutas
            </h3>
            <p className="auth-illustration-text">
              Accede a miles de recetas, información nutricional y
              recomendaciones personalizadas
            </p>
            <div className="auth-illustration-features">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">🍎</div>
                <p>+500 frutas catalogadas</p>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">📖</div>
                <p>Miles de recetas</p>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">🌍</div>
                <p>Frutas de todo el mundo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
