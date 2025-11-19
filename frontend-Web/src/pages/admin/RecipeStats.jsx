import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BookOpen, Apple, Calendar, TrendingUp } from 'lucide-react';
import { getRecipeStats } from '../../services/admin/dashboardService';
import StatCard from '../../components/admin/StatCard';
import '../../styles/dashboard.css';

export default function RecipeStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadRecipeStats();
  }, []);

  const loadRecipeStats = async () => {
    setLoading(true);
    try {
      const data = await getRecipeStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading recipe stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando Estadísticas de Recetas...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-loading">
        <p>No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="dashboard-main">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📖 Estadísticas Detalladas de Recetas</h1>
        <p className="dashboard-subtitle">
          Análisis completo de recetas por frutas utilizadas y cronología
        </p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <StatCard
          title="Total Recetas"
          value={stats.general.total}
          icon={BookOpen}
          color="primary"
          subtitle="Recetas en el sistema"
        />
        <StatCard
          title="Con Frutas"
          value={stats.general.withFruits}
          icon={Apple}
          color="success"
          subtitle={`${((stats.general.withFruits / stats.general.total) * 100).toFixed(1)}% del total`}
        />
        <StatCard
          title="Sin Frutas"
          value={stats.general.withoutFruits}
          icon={Apple}
          color="warning"
          subtitle="Requieren atención"
        />
        <StatCard
          title="Promedio Frutas/Receta"
          value={stats.general.avgFruitsPerRecipe.toFixed(1)}
          icon={TrendingUp}
          color="info"
          subtitle="Por receta"
        />
      </div>

      {/* Top Recipes by Fruit Count */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Apple size={20} />
              Top Recetas con Más Frutas
            </h3>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={stats.topWithFruits}
                layout="vertical"
                margin={{ left: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="title" width={110} />
                <Tooltip />
                <Bar dataKey="fruitCount" name="Frutas" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Top Recipes Table */}
            <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Receta</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Frutas</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Frutas Utilizadas</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topWithFruits.map((recipe, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '0.75rem', color: '#6B7280' }}>{index + 1}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 500 }}>{recipe.title}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700, color: '#10B981' }}>
                        {recipe.fruitCount}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.8125rem', color: '#6B7280' }}>
                        {recipe.fruits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Most Used Fruits in Recipes */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <TrendingUp size={20} />
              Frutas Más Utilizadas en Recetas
            </h3>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={stats.mostUsedFruits || []}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={(entry) => `${entry.name} (${entry.count})`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(stats.mostUsedFruits || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Most Used Fruits Table */}
            <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Fruta</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Recetas</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>% del Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.mostUsedFruits || []).map((fruit, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '0.75rem', color: '#6B7280' }}>{index + 1}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 500 }}>{fruit.name}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700, color: COLORS[index % COLORS.length] }}>
                        {fruit.count}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {((fruit.count / stats.general.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Recipes Without Fruits */}
      {stats.withoutFruits && stats.withoutFruits.length > 0 && (
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Apple size={20} />
              Recetas sin Frutas ({stats.withoutFruits.length})
            </h3>
          </div>
          <div className="chart-card-body">
            <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: '8px', border: '2px solid #FDE68A', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#92400E' }}>
                ⚠️ Estas recetas no tienen frutas asociadas. Considera agregar frutas para mejorar la coherencia de datos.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.withoutFruits.map((recipe, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    background: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1F2937', marginBottom: '0.25rem' }}>
                    {recipe.title}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                    {recipe.description ? recipe.description.substring(0, 100) + '...' : 'Sin descripción'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">
            <Calendar size={20} />
            Cronología de Creación de Recetas
          </h3>
        </div>
        <div className="chart-card-body">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Recetas Creadas"
                stroke={COLORS[0]}
                strokeWidth={2}
                dot={{ fill: COLORS[0], r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Fecha</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Recetas Creadas</th>
                </tr>
              </thead>
              <tbody>
                {stats.timeline.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '0.75rem' }}>{item.date}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
