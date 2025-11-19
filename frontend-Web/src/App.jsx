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
import LandingPage from "./pages/LandingPage";

// Frutas
import FruitList from "./pages/FruitList";
import FruitDetail from "./pages/FruitDetail";
import AddFruit from "./pages/AddFruit";
import EditFruit from "./pages/EditFruit";
import FruitRecognition from "./pages/FruitRecognition";

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
// Reconocimiento de Frutas
import FruitRecognition from "./pages/FruitRecognition";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// 🔒 RUTA PROTEGIDA (requiere login)
function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        Verificando sesión... 🍓
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// 🔐 RUTA SOLO PARA ADMIN
function AdminRoute({ children }) {
  const { token, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        Verificando permisos... 🍓
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  // Verificar si es admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

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
                  <Route path="/" element={<LandingPage />} />

                  {/* ADMIN PANEL - Solo administradores */}
                  <Route
                    path="/home"
                    element={
                      <AdminRoute>
                        <Home />
                      </AdminRoute>
                    }
                  />

                  {/* FRUTAS - Rutas públicas */}
                  <Route path="/fruits" element={<FruitList />} />
                  <Route path="/fruits/:id" element={<FruitDetail />} />
                  <Route path="/recognize" element={<FruitRecognition />} />

                  {/* FRUTAS - Rutas protegidas (solo admin) */}
                  <Route
                    path="/fruits/add"
                    element={
                      <AdminRoute>
                        <AddFruit />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/fruits/edit/:id"
                    element={
                      <AdminRoute>
                        <EditFruit />
                      </AdminRoute>
                    }
                  />

                  {/* RECETAS - Rutas públicas */}
                  <Route path="/recipes" element={<RecipeList />} />
                  <Route path="/recipes/:id" element={<RecipeDetail />} />

                  {/* RECETAS - Rutas protegidas (solo admin) */}
                  <Route
                    path="/recipes/add"
                    element={
                      <AdminRoute>
                        <AddRecipe />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/recipes/edit/:id"
                    element={
                      <AdminRoute>
                        <EditRecipe />
                      </AdminRoute>
                    }
                  />

                  {/* REGIONES - Rutas públicas */}
                  <Route path="/regions" element={<RegionList />} />
                  <Route path="/regions/:id" element={<RegionDetail />} />

                  {/* REGIONES - Rutas protegidas (solo admin) */}
                  <Route
                    path="/regions/add"
                    element={
                      <AdminRoute>
                        <AddRegion />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/regions/edit/:id"
                    element={
                      <AdminRoute>
                        <EditRegion />
                      </AdminRoute>
                    }
                  />

                  {/* USUARIOS - Solo admin */}
                  <Route
                    path="/users"
                    element={
                      <AdminRoute>
                        <UsersPage />
                      </AdminRoute>
                    }
                  />

                  {/* RECONOCIMIENTO DE FRUTAS - Ruta pública */}
                  <Route path="/recognition" element={<FruitRecognition />} />

                  {/* ADMIN DASHBOARD - Solo admin */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <DashboardMain />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <AdminRoute>
                        <Analytics />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/tools"
                    element={
                      <AdminRoute>
                        <AdminTools />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/stats/fruits"
                    element={
                      <AdminRoute>
                        <FruitStats />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/stats/recipes"
                    element={
                      <AdminRoute>
                        <RecipeStats />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/stats/users"
                    element={
                      <AdminRoute>
                        <UserStats />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/stats/regions"
                    element={
                      <AdminRoute>
                        <RegionStats />
                      </AdminRoute>
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
