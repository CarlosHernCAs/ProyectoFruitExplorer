import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import {
  Apple,
  BookOpen,
  MapPin,
  TrendingUp,
  Users,
  Shield,
  Sparkles,
  ChevronRight,
  Star,
} from "lucide-react";
import "../styles/landing.css";

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  const features = [
    {
      icon: Apple,
      title: "Catálogo Extenso",
      description:
        "Explora más de 500 frutas de todo el mundo con información detallada y propiedades nutricionales.",
      color: "primary",
    },
    {
      icon: BookOpen,
      title: "Miles de Recetas",
      description:
        "Descubre recetas deliciosas y saludables con tus frutas favoritas. Filtra por ingredientes y dificultad.",
      color: "success",
    },
    {
      icon: MapPin,
      title: "Regiones del Mundo",
      description:
        "Conoce el origen de cada fruta y las regiones donde se cultivan. Aprende sobre culturas y tradiciones.",
      color: "warning",
    },
    {
      icon: TrendingUp,
      title: "Analytics Avanzado",
      description:
        "Para administradores: accede a estadísticas detalladas y herramientas de gestión profesionales.",
      color: "primary",
    },
  ];

  const stats = [
    { value: "500+", label: "Frutas Catalogadas", icon: Apple },
    { value: "1000+", label: "Recetas Disponibles", icon: BookOpen },
    { value: "50+", label: "Regiones del Mundo", icon: MapPin },
    { value: "10k+", label: "Usuarios Activos", icon: Users },
  ];

  const benefits = [
    {
      title: "Información Verificada",
      description:
        "Todo nuestro contenido es revisado por expertos en nutrición y botánica.",
      icon: Shield,
    },
    {
      title: "Actualizado Constantemente",
      description:
        "Agregamos nuevas frutas, recetas y contenido cada semana.",
      icon: Sparkles,
    },
    {
      title: "Comunidad Activa",
      description:
        "Únete a miles de usuarios que comparten su pasión por las frutas.",
      icon: Users,
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Bienvenido a FruitExplorer</span>
            </div>
            <h1 className="hero-title">
              Descubre el fascinante{" "}
              <span className="hero-gradient-text">mundo de las frutas</span>
            </h1>
            <p className="hero-description">
              Explora frutas exóticas, aprende recetas deliciosas y conoce las
              propiedades nutricionales de cada fruta. Tu guía completa para un
              estilo de vida más saludable.
            </p>
            <div className="hero-actions">
              {!user ? (
                <>
                  <Link to="/register">
                    <Button variant="primary" size="lg" icon={ChevronRight} iconPosition="right">
                      Comenzar Ahora
                    </Button>
                  </Link>
                  <Link to="/fruits">
                    <Button variant="outline" size="lg">
                      Explorar Frutas
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/fruits">
                    <Button variant="primary" size="lg" icon={Apple}>
                      Ver Frutas
                    </Button>
                  </Link>
                  <Link to="/recipes">
                    <Button variant="outline" size="lg" icon={BookOpen}>
                      Ver Recetas
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="hero-social-proof">
              <div className="hero-avatars">
                <div className="hero-avatar">🍎</div>
                <div className="hero-avatar">🍊</div>
                <div className="hero-avatar">🍓</div>
                <div className="hero-avatar">🥭</div>
              </div>
              <p>
                <strong>+10,000 usuarios</strong> ya disfrutan de FruitExplorer
              </p>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=800"
                alt="Variedad de frutas frescas"
                onError={(e) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/415/415733.png";
                }}
              />
              <div className="hero-image-badge">
                <Star size={16} fill="currentColor" />
                <span>Contenido Premium</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <stat.icon className="stat-icon" size={32} />
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Todo lo que necesitas en un solo lugar</h2>
          <p className="section-subtitle">
            Herramientas y contenido diseñado para que explores el mundo de las
            frutas de manera fácil y divertida
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Card key={index} variant="bordered" hover>
              <CardBody>
                <div className={`feature-icon feature-icon--${feature.color}`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <div className="benefits-text">
            <h2 className="benefits-title">¿Por qué elegir FruitExplorer?</h2>
            <p className="benefits-subtitle">
              Somos más que un simple catálogo. Somos tu compañero en el viaje
              hacia un estilo de vida más saludable.
            </p>
            <div className="benefits-list">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <div className="benefit-icon">
                    <benefit.icon size={24} />
                  </div>
                  <div className="benefit-text">
                    <h4>{benefit.title}</h4>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="benefits-image">
            <img
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=600"
              alt="Frutas saludables"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/2329/2329135.png";
              }}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">¿Listo para comenzar tu viaje frutal?</h2>
          <p className="cta-description">
            Únete a miles de usuarios que ya están explorando el mundo de las
            frutas. Es gratis y solo toma un minuto.
          </p>
          <div className="cta-actions">
            {!user ? (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={ChevronRight} iconPosition="right">
                    Crear Cuenta Gratis
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" size="lg">
                    Ya tengo cuenta
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/fruits">
                  <Button variant="primary" size="lg">
                    Explorar Frutas
                  </Button>
                </Link>
                <Link to="/admin/dashboard">
                  <Button variant="outline" size="lg">
                    Ir al Dashboard
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
