import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
import "./styles/dashboard.css";
import Layout from "./components/layout/Layout";
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

// Admin Dashboard
import DashboardMain from "./pages/admin/DashboardMain";
import Analytics from "./pages/admin/Analytics";
import AdminTools from "./pages/admin/AdminTools";
import FruitStats from "./pages/admin/FruitStats";
import RecipeStats from "./pages/admin/RecipeStats";
import UserStats from "./pages/admin/UserStats";
import RegionStats from "./pages/admin/RegionStats";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// 🔒 RUTA PROTEGIDA
function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          {/* AUTENTICACIÓN - Sin Layout (tienen su propio diseño full-page) */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Todas las demás rutas con Layout (Sidebar + Navbar + Footer) */}
          <Route
            path="/*"
            element={
              <Layout>
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
                        <h2>Explora el mundo de las frutas</h2>
                        <p>
                          Bienvenido a <strong>FruitExplorer</strong>, donde podrás
                          ver todas las frutas disponibles.
                        </p>
                      </section>
                    }
                  />

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

                  {/* ADMIN DASHBOARD - Solo admin */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardMain />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/tools"
                    element={
                      <ProtectedRoute>
                        <AdminTools />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/stats/fruits"
                    element={
                      <ProtectedRoute>
                        <FruitStats />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/stats/recipes"
                    element={
                      <ProtectedRoute>
                        <RecipeStats />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/stats/users"
                    element={
                      <ProtectedRoute>
                        <UserStats />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/stats/regions"
                    element={
                      <ProtectedRoute>
                        <RegionStats />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
