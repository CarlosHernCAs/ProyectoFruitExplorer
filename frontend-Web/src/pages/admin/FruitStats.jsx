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
import { Apple, TrendingUp, MapPin, BookOpen, Calendar } from 'lucide-react';
import { getFruitStats } from '../../services/admin/dashboardService';
import StatCard from '../../components/admin/StatCard';
import '../../styles/dashboard.css';

export default function FruitStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadFruitStats();
  }, []);

  const loadFruitStats = async () => {
    setLoading(true);
    try {
      const data = await getFruitStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading fruit stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando Estadísticas de Frutas...</p>
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
        <h1 className="dashboard-title">🍎 Estadísticas Detalladas de Frutas</h1>
        <p className="dashboard-subtitle">
          Análisis completo de frutas por región, recetas y cronología
        </p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <StatCard
          title="Total Frutas"
          value={stats.general.total}
          icon={Apple}
          color="primary"
          subtitle="Frutas en el sistema"
        />
        <StatCard
          title="Con Recetas"
          value={stats.general.withRecipes}
          icon={BookOpen}
          color="success"
          subtitle={`${((stats.general.withRecipes / stats.general.total) * 100).toFixed(1)}% del total`}
        />
        <StatCard
          title="Sin Recetas"
          value={stats.general.withoutRecipes}
          icon={BookOpen}
          color="warning"
          subtitle="Requieren atención"
        />
        <StatCard
          title="Promedio Recetas/Fruta"
          value={stats.general.avgRecipesPerFruit.toFixed(1)}
          icon={TrendingUp}
          color="info"
          subtitle="Por fruta"
        />
      </div>

      {/* By Region */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <MapPin size={20} />
              Frutas por Región
            </h3>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats.byRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Total Frutas" fill={COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Region Details Table */}
            <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Región</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Total Frutas</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>% del Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.byRegion.map((region, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '0.75rem' }}>{region.region}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>
                        {region.total}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {((region.total / stats.general.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Fruits with Most Recipes */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <BookOpen size={20} />
              Top Frutas con Más Recetas
            </h3>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={stats.topWithRecipes}
                layout="vertical"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={90} />
                <Tooltip />
                <Bar dataKey="recipeCount" name="Recetas" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Top Fruits Table */}
            <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Fruta</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Recetas</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topWithRecipes.map((fruit, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '0.75rem', color: '#6B7280' }}>{index + 1}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 500 }}>{fruit.name}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700, color: '#10B981' }}>
                        {fruit.recipeCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Fruits Without Recipes */}
      {stats.withoutRecipes && stats.withoutRecipes.length > 0 && (
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <BookOpen size={20} />
              Frutas sin Recetas ({stats.withoutRecipes.length})
            </h3>
          </div>
          <div className="chart-card-body">
            <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: '8px', border: '2px solid #FDE68A', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#92400E' }}>
                ⚠️ Estas frutas no tienen recetas asociadas. Considera agregar recetas para mejorar la experiencia del usuario.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {stats.withoutRecipes.map((fruit, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    background: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1F2937' }}>
                    {fruit.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                    {fruit.scientific_name}
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
            Cronología de Creación de Frutas
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
                name="Frutas Creadas"
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
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Frutas Creadas</th>
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
