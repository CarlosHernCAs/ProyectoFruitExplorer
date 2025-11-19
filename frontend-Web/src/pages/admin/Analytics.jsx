import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import {
  TrendingUp,
  Activity,
  Calendar,
  Users,
  Heart,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  getTrends,
  getActivityHeatmap,
  getUserEngagement,
  getContentHealth,
  getGrowthProjection,
} from '../../services/admin/analyticsService';
import '../../styles/dashboard.css';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [trends, setTrends] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [contentHealth, setContentHealth] = useState(null);
  const [projection, setProjection] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [trendsData, heatmapData, engagementData, healthData, projectionData] =
        await Promise.all([
          getTrends(period),
          getActivityHeatmap(),
          getUserEngagement(),
          getContentHealth(),
          getGrowthProjection(),
        ]);

      setTrends(trendsData);
      setHeatmap(heatmapData);
      setEngagement(engagementData);
      setContentHealth(healthData);
      setProjection(projectionData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando Analytics...</p>
      </div>
    );
  }

  // Transform heatmap data for visualization
  const heatmapChartData = heatmap?.heatmap
    ? Object.entries(heatmap.heatmap).map(([day, hours]) => ({
        day,
        ...hours,
      }))
    : [];

  // Engagement chart data
  const engagementData = [
    { name: 'DAU', value: engagement?.dau || 0 },
    { name: 'MAU', value: engagement?.mau || 0 },
  ];

  // Content health data
  const healthScore = contentHealth?.overall?.healthScore || 0;
  const healthData = [
    { name: 'Completo', value: healthScore },
    { name: 'Incompleto', value: 100 - healthScore },
  ];

  const COLORS = {
    primary: '#4F46E5',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  };

  return (
    <div className="dashboard-main">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Analytics Avanzado</h1>
        <p className="dashboard-subtitle">
          Análisis profundo de tendencias, engagement y salud de contenido
        </p>
      </div>

      {/* Period Selector */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ marginRight: '1rem', fontWeight: 600 }}>
          Período de análisis:
        </label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '2px solid #e5e7eb',
            fontSize: '0.9375rem',
            cursor: 'pointer',
          }}
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
          <option value="365d">Último año</option>
        </select>
      </div>

      {/* Trends Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <TrendingUp size={20} />
              Tendencias de Crecimiento
            </h3>
          </div>
          <div className="chart-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: '#F0FDF4', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                  Frutas
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981' }}>
                  {trends?.fruits?.growth > 0 ? '+' : ''}
                  {trends?.fruits?.growth?.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                  {trends?.fruits?.avgPerDay?.toFixed(1)} por día
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#EFF6FF', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                  Recetas
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3B82F6' }}>
                  {trends?.recipes?.growth > 0 ? '+' : ''}
                  {trends?.recipes?.growth?.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                  {trends?.recipes?.avgPerDay?.toFixed(1)} por día
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#FEF3C7', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                  Usuarios
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B' }}>
                  {trends?.users?.growth > 0 ? '+' : ''}
                  {trends?.users?.growth?.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                  {trends?.users?.avgPerDay?.toFixed(1)} por día
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#F3F4F6', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                  Regiones
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6B7280' }}>
                  {trends?.regions?.growth > 0 ? '+' : ''}
                  {trends?.regions?.growth?.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                  {trends?.regions?.avgPerDay?.toFixed(2)} por día
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Projection */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Calendar size={20} />
              Proyección de Crecimiento (3 meses)
            </h3>
          </div>
          <div className="chart-card-body">
            {projection && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { month: 'Mes 1', frutas: projection.fruits[0], recetas: projection.recipes[0] },
                    { month: 'Mes 2', frutas: projection.fruits[1], recetas: projection.recipes[1] },
                    { month: 'Mes 3', frutas: projection.fruits[2], recetas: projection.recipes[2] },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="frutas"
                    stroke={COLORS.success}
                    strokeWidth={2}
                    dot={{ fill: COLORS.success, r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="recetas"
                    stroke={COLORS.info}
                    strokeWidth={2}
                    dot={{ fill: COLORS.info, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* User Engagement */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Users size={20} />
              Engagement de Usuarios
            </h3>
          </div>
          <div className="chart-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                    Usuarios Activos Diarios (DAU)
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1F2937' }}>
                    {engagement?.dau || 0}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                    Usuarios Activos Mensuales (MAU)
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1F2937' }}>
                    {engagement?.mau || 0}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                    Tasa de Retención
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: COLORS.success }}>
                    {engagement?.retentionRate?.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                    Engagement Score
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: COLORS.primary }}>
                    {engagement?.engagementScore?.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Health */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Heart size={20} />
              Salud del Contenido
            </h3>
          </div>
          <div className="chart-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={healthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      <Cell fill={COLORS.success} />
                      <Cell fill={COLORS.danger} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                    Health Score General
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: healthScore >= 80 ? COLORS.success : healthScore >= 60 ? COLORS.warning : COLORS.danger }}>
                    {healthScore.toFixed(0)}%
                  </div>
                </div>
                <div style={{ padding: '1rem', background: '#F9FAFB', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Frutas
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                    Completas: {contentHealth?.fruits?.complete || 0} / {contentHealth?.fruits?.total || 0}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                    Score: {contentHealth?.fruits?.score?.toFixed(1)}%
                  </div>
                </div>
                <div style={{ padding: '1rem', background: '#F9FAFB', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Recetas
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                    Completas: {contentHealth?.recipes?.complete || 0} / {contentHealth?.recipes?.total || 0}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                    Score: {contentHealth?.recipes?.score?.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Items needing attention */}
            {contentHealth?.needsAttention && contentHealth.needsAttention.length > 0 && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#FEF2F2', borderRadius: '8px', border: '2px solid #FEE2E2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <AlertCircle size={20} color={COLORS.danger} />
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1F2937' }}>
                    Requiere Atención ({contentHealth.needsAttention.length})
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {contentHealth.needsAttention.slice(0, 10).map((item, index) => (
                    <div key={index} style={{ fontSize: '0.8125rem', color: '#6B7280', padding: '0.5rem', background: 'white', borderRadius: '4px' }}>
                      <strong>{item.type}:</strong> {item.name} - {item.reason}
                    </div>
                  ))}
                  {contentHealth.needsAttention.length > 10 && (
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF', textAlign: 'center', marginTop: '0.5rem' }}>
                      ... y {contentHealth.needsAttention.length - 10} más
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">
            <Activity size={20} />
            Mapa de Calor de Actividad
          </h3>
        </div>
        <div className="chart-card-body">
          {heatmapChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={heatmapChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(heatmapChartData[0] || {})
                  .filter((key) => key !== 'day')
                  .slice(0, 5)
                  .map((hour, index) => (
                    <Bar
                      key={hour}
                      dataKey={hour}
                      fill={`hsl(${index * 60}, 70%, 50%)`}
                      stackId="a"
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
              <Activity size={48} style={{ margin: '0 auto 1rem' }} />
              <p>No hay suficiente actividad para generar el mapa de calor</p>
            </div>
          )}
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#F9FAFB', borderRadius: '8px', fontSize: '0.875rem', color: '#6B7280' }}>
            <strong>Total de registros analizados:</strong> {heatmap?.totalRecords || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
