import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Input from "./components/ui/Input";
import Button from "./components/ui/Button";
import { Card, CardBody } from "./components/ui/Card";
import { Mail, Lock, User, UserPlus, Apple } from "lucide-react";
import "./styles/auth.css";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validaciones del frontend
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!acceptedTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: displayName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al registrar");
        return;
      }

      setMessage(data.message || "Registro exitoso");

      if (data.token) {
        // ✔ Usar el contexto para guardar la sesión
        login(data.token, data.user);
        // ✔ Redirigir sin recargar la página
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
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
              <h2 className="auth-title">Crear una cuenta</h2>
              <p className="auth-subtitle">
                Únete a nuestra comunidad y descubre el mundo de las frutas
              </p>
            </div>

            {/* Form Card */}
            <Card variant="default" padding="lg">
              <CardBody>
                <form onSubmit={handleRegister} className="auth-form">
                  <Input
                    label="Nombre de usuario"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    icon={User}
                    placeholder="Tu nombre"
                    required
                  />

                  <Input
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    placeholder="tu@email.com"
                    required
                  />

                  <Input
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                    placeholder="••••••••"
                    helperText="Mínimo 6 caracteres"
                    required
                  />

                  <Input
                    label="Confirmar contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={Lock}
                    placeholder="••••••••"
                    error={
                      confirmPassword && password !== confirmPassword
                        ? "Las contraseñas no coinciden"
                        : ""
                    }
                    required
                  />

                  {/* Terms & Conditions */}
                  <div className="auth-terms">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      required
                    />
                    <label htmlFor="terms">
                      Acepto los{" "}
                      <a href="/terms" target="_blank" rel="noopener noreferrer">
                        términos y condiciones
                      </a>{" "}
                      y la{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer">
                        política de privacidad
                      </a>
                    </label>
                  </div>

                  {error && (
                    <div className="auth-error">
                      <p>{error}</p>
                    </div>
                  )}

                  {message && !error && (
                    <div className="auth-success">
                      <p>{message}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    icon={UserPlus}
                    iconPosition="right"
                  >
                    {loading ? "Registrando..." : "Crear Cuenta"}
                  </Button>
                </form>
              </CardBody>
            </Card>

            {/* Footer Links */}
            <div className="auth-footer">
              <p className="auth-footer-text">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="auth-link">
                  Inicia sesión aquí
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
              Únete a nuestra comunidad
            </h3>
            <p className="auth-illustration-text">
              Crea tu cuenta y comienza a explorar frutas, recetas y mucho más
            </p>
            <div className="auth-illustration-features">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">🎯</div>
                <p>Acceso ilimitado</p>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">⭐</div>
                <p>Guarda tus favoritos</p>
              </div>
              <div className="auth-feature-item">
                <div className="auth-feature-icon">🔔</div>
                <p>Recibe recomendaciones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
