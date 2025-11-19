import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MapPin, Apple, Calendar, TrendingUp } from 'lucide-react';
import { getRegionStats } from '../../services/admin/dashboardService';
import StatCard from '../../components/admin/StatCard';
import '../../styles/dashboard.css';

export default function RegionStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadRegionStats();
  }, []);

  const loadRegionStats = async () => {
    setLoading(true);
    try {
      const data = await getRegionStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading region stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando Estadísticas de Regiones...</p>
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

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  // Find top region
  const topRegion = stats.byFruits.reduce((max, region) =>
    region.fruitCount > max.fruitCount ? region : max
  , stats.byFruits[0] || { name: 'N/A', fruitCount: 0 });

  const totalFruits = stats.byFruits.reduce((sum, region) => sum + region.fruitCount, 0);
  const avgFruitsPerRegion = stats.general.total > 0 ? (totalFruits / stats.general.total).toFixed(1) : 0;

  return (
    <div className="dashboard-main">
      <div className="dashboard-header">
        <h1 className="dashboard-title">🗺️ Estadísticas Detalladas de Regiones</h1>
        <p className="dashboard-subtitle">
          Análisis completo de regiones y su distribución de frutas
        </p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <StatCard
          title="Total Regiones"
          value={stats.general.total}
          icon={MapPin}
          color="primary"
          subtitle="Regiones registradas"
        />
        <StatCard
          title="Con Frutas"
          value={stats.general.withFruits}
          icon={Apple}
          color="success"
          subtitle={`${((stats.general.withFruits / stats.general.total) * 100).toFixed(1)}% del total`}
        />
        <StatCard
          title="Región Top"
          value={topRegion.name}
          icon={TrendingUp}
          color="info"
          subtitle={`${topRegion.fruitCount} frutas`}
        />
        <StatCard
          title="Promedio Frutas/Región"
          value={avgFruitsPerRegion}
          icon={Apple}
          color="warning"
          subtitle="Por región"
        />
      </div>

      {/* Regions by Fruit Count */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Apple size={20} />
              Frutas por Región
            </h3>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats.byFruits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fruitCount" name="Frutas">
                  {stats.byFruits.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Regions Table */}
            <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Región</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Frutas</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>% del Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.byFruits.map((region, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '0.75rem', color: '#6B7280' }}>{index + 1}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '3px',
                              background: COLORS[index % COLORS.length],
                            }}
                          ></div>
                          {region.name}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700, color: COLORS[index % COLORS.length] }}>
                        {region.fruitCount}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {totalFruits > 0 ? ((region.fruitCount / totalFruits) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Distribution Pie Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <TrendingUp size={20} />
              Distribución de Frutas
            </h3>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={stats.byFruits.filter((r) => r.fruitCount > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={(entry) => `${entry.name} (${entry.fruitCount})`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="fruitCount"
                >
                  {stats.byFruits
                    .filter((r) => r.fruitCount > 0)
                    .map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#EFF6FF', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                Análisis de Distribución
              </h4>
              <ul style={{ fontSize: '0.8125rem', color: '#1F2937', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                <li>
                  <strong>Total de asociaciones fruta-región:</strong> {totalFruits}
                </li>
                <li>
                  <strong>Regiones con frutas:</strong> {stats.general.withFruits} de {stats.general.total}
                </li>
                <li>
                  <strong>Regiones sin frutas:</strong> {stats.general.total - stats.general.withFruits}
                </li>
                <li>
                  <strong>Promedio de frutas por región:</strong> {avgFruitsPerRegion}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Regions Without Fruits */}
      {stats.withoutFruits && stats.withoutFruits.length > 0 && (
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Apple size={20} />
              Regiones sin Frutas ({stats.withoutFruits.length})
            </h3>
          </div>
          <div className="chart-card-body">
            <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: '8px', border: '2px solid #FDE68A', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#92400E' }}>
                ⚠️ Estas regiones no tienen frutas asociadas. Considera agregar frutas para mejorar la cobertura geográfica.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {stats.withoutFruits.map((region, index) => (
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
                    {region.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                    {region.description ? region.description.substring(0, 60) + '...' : 'Sin descripción'}
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
            Cronología de Creación de Regiones
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
                name="Regiones Creadas"
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
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Regiones Creadas</th>
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

      {/* Region Details Cards */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">
            <MapPin size={20} />
            Detalle de Regiones
          </h3>
        </div>
        <div className="chart-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {stats.byFruits.map((region, index) => (
              <div
                key={index}
                style={{
                  padding: '1.5rem',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '2px solid #E5E7EB',
                  borderLeftWidth: '4px',
                  borderLeftColor: COLORS[index % COLORS.length],
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: COLORS[index % COLORS.length],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                    }}
                  >
                    {region.fruitCount}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1F2937' }}>
                      {region.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      {region.fruitCount} {region.fruitCount === 1 ? 'fruta' : 'frutas'}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: '6px',
                    background: '#E5E7EB',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: COLORS[index % COLORS.length],
                      width: `${totalFruits > 0 ? (region.fruitCount / totalFruits) * 100 : 0}%`,
                      transition: 'width 0.3s',
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
