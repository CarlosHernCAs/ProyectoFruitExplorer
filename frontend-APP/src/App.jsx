import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Login from "./login";
import Register from "./register";
import Home from "./Home";           
import FruitList from "./pages/FruitList";
import AddFruit from "./pages/AddFruit";
import EditFruit from "./pages/EditFruit";
import UsersPage from "./pages/UsersPage";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// 🔒 RUTA PROTEGIDA
function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      {/* ----------- HEADER ----------- */}
      <header>
        🍓 FruitExplorer
        <nav>
          <Link to="/">Inicio</Link>

          {/* 🔄 CAMBIO: YA NO SE MUESTRA REGISTRO */}
          <Link to="/fruits">Frutas</Link>

          {!token && <Link to="/login">Login</Link>}

          {token && (
            <>
              <Link to="/home">Admin</Link>
              <Link to="/users">Usuarios</Link>
            </>
          )}
        </nav>
      </header>

      {/* ----------- CONTENIDO ----------- */}
      <main>
        <Routes>
          {/* Inicio */}
          <Route
            path="/"
            element={
              <section className="section">
                <img
                  className="home-hero-img"
                  src="https://cdn-icons-png.flaticon.com/512/415/415733.png"
                  alt="Fruta"
                />
                <h2>Explora el mundo de las frutas 🍍</h2>
                <p>
                  Bienvenido a <strong>FruitExplorer</strong>, donde podrás
                  ver todas las frutas disponibles.
                </p>

                {/* ❌ ELIMINADO EL BOTÓN “COMENZAR AHORA” */}
              </section>
            }
          />

          {/* LOGIN (mantengo registro por si lo necesitas luego, pero ya no aparece en menú) */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* ADMIN PANEL */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* FRUTAS – 🔓 YA NO PROTEGIDO, TODOS PUEDEN VER */}
          <Route path="/fruits" element={<FruitList />} />

          {/* CRUD de frutas solo para admin */}
          <Route
            path="/fruits/add"
            element={
              <ProtectedRoute>
                <AddFruit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fruits/edit/:id"
            element={
              <ProtectedRoute>
                <EditFruit />
              </ProtectedRoute>
            }
          />

          {/* USERS PAGE */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* ----------- FOOTER ----------- */}
      <footer>© 2025 FruitExplorer | Desarrollado con 💚</footer>
    </Router>
  );
}

export default App;
