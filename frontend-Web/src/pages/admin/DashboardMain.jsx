import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Apple, BookOpen, Users, Globe, TrendingUp,
  Activity, Calendar, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import StatCard from '../../components/admin/StatCard';
import { getBasicStats, getOverview } from '../../services/admin/dashboardService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function DashboardMain() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, overviewData] = await Promise.all([
        getBasicStats(),
        getOverview()
      ]);

      setStats(statsData);
      setOverview(overviewData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      toast.error('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  // Preparar datos para gráficas
  const regionData = overview?.topFruits?.map(fruit => ({
    name: fruit.common_name,
    recetas: fruit.recipeCount
  })) || [];

  return (
    <div className="dashboard-main">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Dashboard Administrativo</h1>
        <p className="dashboard-subtitle">
          Resumen general del sistema FruitExplorer
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Frutas"
          value={stats?.stats?.totalFruits || 0}
          icon={Apple}
          color="success"
          change={stats?.growth?.fruitsThisMonth > 0 ?
            ((stats.growth.fruitsThisMonth / (stats.growth.fruitsLastMonth || 1)) * 100 - 100).toFixed(1) :
            0
          }
          changeLabel="vs mes anterior"
        />

        <StatCard
          title="Total Recetas"
          value={stats?.stats?.totalRecipes || 0}
          icon={BookOpen}
          color="primary"
          subtitle={`${stats?.stats?.totalRecipeSteps || 0} pasos totales`}
        />

        <StatCard
          title="Total Usuarios"
          value={stats?.stats?.totalUsers || 0}
          icon={Users}
          color="purple"
          change={stats?.growth?.usersThisMonth > 0 ?
            ((stats.growth.usersThisMonth / (stats.growth.usersLastMonth || 1)) * 100 - 100).toFixed(1) :
            0
          }
          changeLabel="vs mes anterior"
        />

        <StatCard
          title="Regiones"
          value={stats?.stats?.totalRegions || 0}
          icon={Globe}
          color="indigo"
          subtitle={`${stats?.stats?.totalFruitRecipeLinks || 0} relaciones`}
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Top Frutas con más recetas */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <TrendingUp size={20} />
              Top 5 Frutas con Más Recetas
            </h3>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="recetas" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Activity size={20} />
              Distribución del Contenido
            </h3>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Frutas', value: stats?.stats?.totalFruits || 0 },
                    { name: 'Recetas', value: stats?.stats?.totalRecipes || 0 },
                    { name: 'Regiones', value: stats?.stats?.totalRegions || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="activity-card">
          <div className="activity-card-header">
            <h3 className="activity-card-title">
              <Calendar size={20} />
              Últimas Frutas Agregadas
            </h3>
          </div>
          <div className="activity-card-body">
            {overview?.recentFruits?.map((fruit) => (
              <div key={fruit.id} className="activity-item">
                <div className="activity-item-icon">
                  {fruit.image_url ? (
                    <img src={fruit.image_url} alt={fruit.common_name} />
                  ) : (
                    <Apple size={24} />
                  )}
                </div>
                <div className="activity-item-content">
                  <h4>{fruit.common_name}</h4>
                  <p>{fruit.scientific_name || 'Sin nombre científico'}</p>
                </div>
                <div className="activity-item-date">
                  {new Date(fruit.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-card">
          <div className="activity-card-header">
            <h3 className="activity-card-title">
              <Users size={20} />
              Usuarios Recientes
            </h3>
          </div>
          <div className="activity-card-body">
            {overview?.recentUsers?.map((user) => (
              <div key={user.id} className="activity-item">
                <div className="activity-item-icon user-icon">
                  {user.display_name ? user.display_name[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <div className="activity-item-content">
                  <h4>{user.display_name || user.email}</h4>
                  <p className="text-sm">
                    {user.last_login ?
                      `Último login: ${new Date(user.last_login).toLocaleDateString()}` :
                      'Nunca hizo login'
                    }
                  </p>
                </div>
                <div className="activity-item-date">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="quick-actions-title">Acciones Rápidas</h3>
        <div className="quick-actions-grid">
          <button
            className="quick-action-btn"
            onClick={() => window.location.href = '/admin/fruits/stats'}
          >
            <Apple size={20} />
            <span>Estadísticas de Frutas</span>
            <ArrowRight size={16} />
          </button>

          <button
            className="quick-action-btn"
            onClick={() => window.location.href = '/admin/analytics'}
          >
            <Activity size={20} />
            <span>Analytics Avanzados</span>
            <ArrowRight size={16} />
          </button>

          <button
            className="quick-action-btn"
            onClick={() => window.location.href = '/admin/tools'}
          >
            <TrendingUp size={20} />
            <span>Herramientas Admin</span>
            <ArrowRight size={16} />
          </button>

          <button
            className="quick-action-btn"
            onClick={() => window.location.href = '/fruits/add'}
          >
            <Apple size={20} />
            <span>Agregar Nueva Fruta</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
