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
import { Users, Shield, Calendar, TrendingUp } from 'lucide-react';
import { getUserStats } from '../../services/admin/dashboardService';
import StatCard from '../../components/admin/StatCard';
import '../../styles/dashboard.css';

export default function UserStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    setLoading(true);
    try {
      const data = await getUserStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando Estadísticas de Usuarios...</p>
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

  const COLORS = {
    admin: '#EF4444',
    editor: '#F59E0B',
    user: '#10B981',
  };

  const roleChartData = stats.byRole.map((role) => ({
    name: role.role,
    value: role.count,
  }));

  return (
    <div className="dashboard-main">
      <div className="dashboard-header">
        <h1 className="dashboard-title">👥 Estadísticas Detalladas de Usuarios</h1>
        <p className="dashboard-subtitle">
          Análisis completo de usuarios por rol y actividad
        </p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <StatCard
          title="Total Usuarios"
          value={stats.general.total}
          icon={Users}
          color="primary"
          subtitle="Usuarios registrados"
        />
        <StatCard
          title="Administradores"
          value={stats.byRole.find((r) => r.role === 'admin')?.count || 0}
          icon={Shield}
          color="danger"
          subtitle="Acceso completo"
        />
        <StatCard
          title="Editores"
          value={stats.byRole.find((r) => r.role === 'editor')?.count || 0}
          icon={Shield}
          color="warning"
          subtitle="Gestión de contenido"
        />
        <StatCard
          title="Usuarios"
          value={stats.byRole.find((r) => r.role === 'user')?.count || 0}
          icon={Users}
          color="success"
          subtitle="Acceso básico"
        />
      </div>

      {/* Users by Role */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Shield size={20} />
              Distribución de Usuarios por Rol
            </h3>
          </div>
          <div className="chart-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={(entry) => `${entry.name} (${entry.value})`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6B7280'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                {stats.byRole.map((role, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      background: '#F9FAFB',
                      borderRadius: '8px',
                      border: '2px solid #E5E7EB',
                      borderLeftWidth: '4px',
                      borderLeftColor: COLORS[role.role] || '#6B7280',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', textTransform: 'capitalize' }}>
                          {role.role}
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937' }}>
                          {role.count}
                        </div>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS[role.role] || '#6B7280' }}>
                        {((role.count / stats.general.total) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Role Comparison Bar Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <TrendingUp size={20} />
              Comparación de Roles
            </h3>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byRole}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Cantidad de Usuarios">
                  {stats.byRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.role] || '#6B7280'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#EFF6FF', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                Permisos por Rol
              </h4>
              <ul style={{ fontSize: '0.8125rem', color: '#1F2937', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                <li>
                  <strong style={{ color: COLORS.admin }}>Admin:</strong> Acceso total al sistema, gestión de usuarios y configuración
                </li>
                <li>
                  <strong style={{ color: COLORS.editor }}>Editor:</strong> Crear, editar y eliminar frutas, recetas y regiones
                </li>
                <li>
                  <strong style={{ color: COLORS.user }}>User:</strong> Ver contenido público, sin permisos de edición
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">
            <Calendar size={20} />
            Cronología de Registro de Usuarios
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
                name="Usuarios Registrados"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ fill: '#4F46E5', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Fecha</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Usuarios Registrados</th>
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

      {/* Recent Users Activity */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">
            <Users size={20} />
            Resumen de Actividad
          </h3>
        </div>
        <div className="chart-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                Total de Usuarios
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                {stats.general.total}
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                Staff (Admin + Editor)
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                {(stats.byRole.find((r) => r.role === 'admin')?.count || 0) +
                  (stats.byRole.find((r) => r.role === 'editor')?.count || 0)}
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                Usuarios Regulares
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                {stats.byRole.find((r) => r.role === 'user')?.count || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
