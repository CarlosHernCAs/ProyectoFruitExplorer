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

// Frutas
import FruitList from "./pages/FruitList";
import FruitDetail from "./pages/FruitDetail";
import AddFruit from "./pages/AddFruit";
import EditFruit from "./pages/EditFruit";

// Recetas
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";

// Regiones
import RegionList from "./pages/RegionList";
import RegionDetail from "./pages/RegionDetail";
import AddRegion from "./pages/AddRegion";
import EditRegion from "./pages/EditRegion";

// Usuarios
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
          <Link to="/fruits">Frutas</Link>
          <Link to="/recipes">Recetas</Link>
          <Link to="/regions">Regiones</Link>

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

          {/* AUTENTICACIÓN */}
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

          {/* FRUTAS - Rutas públicas */}
          <Route path="/fruits" element={<FruitList />} />
          <Route path="/fruits/:id" element={<FruitDetail />} />

          {/* FRUTAS - Rutas protegidas (admin) */}
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

          {/* RECETAS - Rutas públicas */}
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />

          {/* RECETAS - Rutas protegidas (admin) */}
          <Route
            path="/recipes/add"
            element={
              <ProtectedRoute>
                <AddRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/edit/:id"
            element={
              <ProtectedRoute>
                <EditRecipe />
              </ProtectedRoute>
            }
          />

          {/* REGIONES - Rutas públicas */}
          <Route path="/regions" element={<RegionList />} />
          <Route path="/regions/:id" element={<RegionDetail />} />

          {/* REGIONES - Rutas protegidas (admin) */}
          <Route
            path="/regions/add"
            element={
              <ProtectedRoute>
                <AddRegion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/regions/edit/:id"
            element={
              <ProtectedRoute>
                <EditRegion />
              </ProtectedRoute>
            }
          />

          {/* USUARIOS - Solo admin */}
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
