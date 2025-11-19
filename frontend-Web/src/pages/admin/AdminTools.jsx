import { useState } from 'react';
import {
  Trash2,
  Download,
  MapPin,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileJson,
  FileSpreadsheet,
  Wrench,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  bulkDeleteFruits,
  bulkDeleteRecipes,
  bulkAssignRegion,
  bulkAssignRole,
  exportFruits,
  exportRecipes,
  exportUsers,
  exportRegions,
  healthCheck,
  fixOrphans,
  downloadFile,
} from '../../services/admin/adminService';
import '../../styles/dashboard.css';

export default function AdminTools() {
  const [selectedFruits, setSelectedFruits] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState('');
  const [regionId, setRegionId] = useState('');
  const [selectedUsers, setSelectedUsers] = useState('');
  const [roleId, setRoleId] = useState('');
  const [healthResults, setHealthResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Bulk Delete Fruits
  const handleBulkDeleteFruits = async () => {
    if (!selectedFruits.trim()) {
      toast.error('Por favor ingresa IDs de frutas');
      return;
    }

    const ids = selectedFruits.split(',').map((id) => id.trim()).filter(Boolean);
    if (ids.length === 0) {
      toast.error('IDs de frutas inválidos');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar ${ids.length} fruta(s)?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await bulkDeleteFruits(ids);
      toast.success(`${result.deleted} fruta(s) eliminada(s) exitosamente`);
      setSelectedFruits('');
    } catch (error) {
      toast.error(error.message || 'Error al eliminar frutas');
    } finally {
      setLoading(false);
    }
  };

  // Bulk Delete Recipes
  const handleBulkDeleteRecipes = async () => {
    if (!selectedRecipes.trim()) {
      toast.error('Por favor ingresa IDs de recetas');
      return;
    }

    const ids = selectedRecipes.split(',').map((id) => id.trim()).filter(Boolean);
    if (ids.length === 0) {
      toast.error('IDs de recetas inválidos');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar ${ids.length} receta(s)?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await bulkDeleteRecipes(ids);
      toast.success(`${result.deleted} receta(s) eliminada(s) exitosamente`);
      setSelectedRecipes('');
    } catch (error) {
      toast.error(error.message || 'Error al eliminar recetas');
    } finally {
      setLoading(false);
    }
  };

  // Bulk Assign Region
  const handleBulkAssignRegion = async () => {
    if (!selectedFruits.trim() || !regionId.trim()) {
      toast.error('Por favor ingresa IDs de frutas y región');
      return;
    }

    const fruitIds = selectedFruits.split(',').map((id) => id.trim()).filter(Boolean);
    if (fruitIds.length === 0) {
      toast.error('IDs de frutas inválidos');
      return;
    }

    setLoading(true);
    try {
      const result = await bulkAssignRegion(fruitIds, regionId);
      toast.success(`${result.assigned} fruta(s) asignada(s) a región exitosamente`);
      setSelectedFruits('');
      setRegionId('');
    } catch (error) {
      toast.error(error.message || 'Error al asignar región');
    } finally {
      setLoading(false);
    }
  };

  // Bulk Assign Role
  const handleBulkAssignRole = async () => {
    if (!selectedUsers.trim() || !roleId.trim()) {
      toast.error('Por favor ingresa IDs de usuarios y rol');
      return;
    }

    const userIds = selectedUsers.split(',').map((id) => id.trim()).filter(Boolean);
    if (userIds.length === 0) {
      toast.error('IDs de usuarios inválidos');
      return;
    }

    setLoading(true);
    try {
      const result = await bulkAssignRole(userIds, roleId);
      toast.success(`${result.assigned} usuario(s) actualizado(s) exitosamente`);
      setSelectedUsers('');
      setRoleId('');
    } catch (error) {
      toast.error(error.message || 'Error al asignar rol');
    } finally {
      setLoading(false);
    }
  };

  // Export Functions
  const handleExport = async (type, format) => {
    setLoading(true);
    try {
      let result;
      switch (type) {
        case 'fruits':
          result = await exportFruits(format);
          break;
        case 'recipes':
          result = await exportRecipes(format);
          break;
        case 'users':
          result = await exportUsers(format);
          break;
        case 'regions':
          result = await exportRegions(format);
          break;
        default:
          throw new Error('Tipo de exportación desconocido');
      }

      if (format === 'csv') {
        downloadFile(result, `${type}_${new Date().toISOString().split('T')[0]}.csv`);
        toast.success(`${type} exportado como CSV`);
      } else {
        downloadFile(
          new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }),
          `${type}_${new Date().toISOString().split('T')[0]}.json`
        );
        toast.success(`${type} exportado como JSON`);
      }
    } catch (error) {
      toast.error(error.message || 'Error al exportar');
    } finally {
      setLoading(false);
    }
  };

  // Health Check
  const handleHealthCheck = async () => {
    setLoading(true);
    try {
      const result = await healthCheck();
      setHealthResults(result);
      toast.success('Chequeo de salud completado');
    } catch (error) {
      toast.error(error.message || 'Error al realizar chequeo de salud');
    } finally {
      setLoading(false);
    }
  };

  // Fix Orphans
  const handleFixOrphans = async () => {
    if (!confirm('¿Estás seguro de eliminar relaciones huérfanas?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await fixOrphans();
      toast.success(
        `Relaciones corregidas: ${result.fruitRegions} fruit_regions, ${result.recipeFruits} recipe_fruits`
      );
      handleHealthCheck(); // Refresh health check
    } catch (error) {
      toast.error(error.message || 'Error al corregir huérfanos');
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 90) return '#10B981';
    if (score >= 70) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="dashboard-main">
      <div className="dashboard-header">
        <h1 className="dashboard-title">🛠️ Herramientas de Administración</h1>
        <p className="dashboard-subtitle">
          Operaciones masivas, exportaciones y mantenimiento del sistema
        </p>
      </div>

      {/* Bulk Operations */}
      <div className="activity-section">
        {/* Bulk Delete Fruits */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h3 className="activity-card-title">
              <Trash2 size={20} />
              Eliminar Frutas en Masa
            </h3>
          </div>
          <div className="activity-card-body">
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                IDs de Frutas (separados por coma)
              </label>
              <input
                type="text"
                value={selectedFruits}
                onChange={(e) => setSelectedFruits(e.target.value)}
                placeholder="Ej: 1, 2, 3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                }}
              />
            </div>
            <button
              onClick={handleBulkDeleteFruits}
              disabled={loading}
              className="quick-action-btn"
              style={{ background: '#FEE2E2', borderColor: '#FECACA', color: '#DC2626' }}
            >
              <Trash2 size={20} />
              <span>Eliminar Frutas</span>
            </button>
          </div>
        </div>

        {/* Bulk Assign Region */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h3 className="activity-card-title">
              <MapPin size={20} />
              Asignar Región en Masa
            </h3>
          </div>
          <div className="activity-card-body">
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                IDs de Frutas
              </label>
              <input
                type="text"
                value={selectedFruits}
                onChange={(e) => setSelectedFruits(e.target.value)}
                placeholder="Ej: 1, 2, 3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  marginBottom: '0.75rem',
                }}
              />
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                ID de Región
              </label>
              <input
                type="text"
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                placeholder="Ej: 1"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                }}
              />
            </div>
            <button
              onClick={handleBulkAssignRegion}
              disabled={loading}
              className="quick-action-btn"
            >
              <MapPin size={20} />
              <span>Asignar Región</span>
            </button>
          </div>
        </div>
      </div>

      <div className="activity-section">
        {/* Bulk Delete Recipes */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h3 className="activity-card-title">
              <Trash2 size={20} />
              Eliminar Recetas en Masa
            </h3>
          </div>
          <div className="activity-card-body">
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                IDs de Recetas (separados por coma)
              </label>
              <input
                type="text"
                value={selectedRecipes}
                onChange={(e) => setSelectedRecipes(e.target.value)}
                placeholder="Ej: 1, 2, 3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                }}
              />
            </div>
            <button
              onClick={handleBulkDeleteRecipes}
              disabled={loading}
              className="quick-action-btn"
              style={{ background: '#FEE2E2', borderColor: '#FECACA', color: '#DC2626' }}
            >
              <Trash2 size={20} />
              <span>Eliminar Recetas</span>
            </button>
          </div>
        </div>

        {/* Bulk Assign Role */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h3 className="activity-card-title">
              <Shield size={20} />
              Asignar Rol en Masa
            </h3>
          </div>
          <div className="activity-card-body">
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                IDs de Usuarios
              </label>
              <input
                type="text"
                value={selectedUsers}
                onChange={(e) => setSelectedUsers(e.target.value)}
                placeholder="Ej: 1, 2, 3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  marginBottom: '0.75rem',
                }}
              />
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                ID de Rol (1=admin, 2=editor, 3=user)
              </label>
              <input
                type="text"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                placeholder="Ej: 2"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                }}
              />
            </div>
            <button
              onClick={handleBulkAssignRole}
              disabled={loading}
              className="quick-action-btn"
            >
              <Shield size={20} />
              <span>Asignar Rol</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">
            <Download size={20} />
            Exportar Datos
          </h3>
        </div>
        <div className="chart-card-body">
          <div className="quick-actions-grid">
            <button
              onClick={() => handleExport('fruits', 'json')}
              disabled={loading}
              className="quick-action-btn"
            >
              <FileJson size={20} />
              <span>Frutas (JSON)</span>
            </button>
            <button
              onClick={() => handleExport('fruits', 'csv')}
              disabled={loading}
              className="quick-action-btn"
            >
              <FileSpreadsheet size={20} />
              <span>Frutas (CSV)</span>
            </button>
            <button
              onClick={() => handleExport('recipes', 'json')}
              disabled={loading}
              className="quick-action-btn"
            >
              <FileJson size={20} />
              <span>Recetas (JSON)</span>
            </button>
            <button
              onClick={() => handleExport('recipes', 'csv')}
              disabled={loading}
              className="quick-action-btn"
            >
              <FileSpreadsheet size={20} />
              <span>Recetas (CSV)</span>
            </button>
            <button
              onClick={() => handleExport('users', 'json')}
              disabled={loading}
              className="quick-action-btn"
            >
              <FileJson size={20} />
              <span>Usuarios (JSON)</span>
            </button>
            <button
              onClick={() => handleExport('users', 'csv')}
              disabled={loading}
              className="quick-action-btn"
            >
              <FileSpreadsheet size={20} />
              <span>Usuarios (CSV)</span>
            </button>
            <button
              onClick={() => handleExport('regions', 'json')}
              disabled={loading}
              className="quick-action-btn"
            >
              <FileJson size={20} />
              <span>Regiones (JSON)</span>
            </button>
            <button
              onClick={() => handleExport('regions', 'csv')}
              disabled={loading}
              className="quick-action-btn"
            >
              <FileSpreadsheet size={20} />
              <span>Regiones (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Health Check */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">
            <Wrench size={20} />
            Chequeo de Salud del Sistema
          </h3>
        </div>
        <div className="chart-card-body">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={handleHealthCheck}
              disabled={loading}
              className="quick-action-btn"
              style={{ flex: 1 }}
            >
              <RefreshCw size={20} />
              <span>Ejecutar Chequeo de Salud</span>
            </button>
            {healthResults && healthResults.issues.orphanRelations.total > 0 && (
              <button
                onClick={handleFixOrphans}
                disabled={loading}
                className="quick-action-btn"
                style={{ flex: 1, background: '#FEF3C7', borderColor: '#FDE68A', color: '#D97706' }}
              >
                <Wrench size={20} />
                <span>Corregir Relaciones Huérfanas</span>
              </button>
            )}
          </div>

          {healthResults && (
            <div>
              {/* Health Score */}
              <div
                style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  color: 'white',
                }}
              >
                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                  Health Score General
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 700 }}>
                  {healthResults.healthScore.toFixed(0)}%
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  {healthResults.issues.total} problema(s) encontrado(s)
                </div>
              </div>

              {/* Issues Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: '8px', border: '2px solid #FEE2E2' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                    Imágenes Faltantes
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#DC2626' }}>
                    {healthResults.issues.missingImages}
                  </div>
                </div>
                <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: '8px', border: '2px solid #FEE2E2' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                    Descripciones Faltantes
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#DC2626' }}>
                    {healthResults.issues.missingDescriptions}
                  </div>
                </div>
                <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: '8px', border: '2px solid #FEE2E2' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                    Recetas sin Pasos
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#DC2626' }}>
                    {healthResults.issues.recipesWithoutSteps}
                  </div>
                </div>
                <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: '8px', border: '2px solid #FEE2E2' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                    Relaciones Huérfanas
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#DC2626' }}>
                    {healthResults.issues.orphanRelations.total}
                  </div>
                </div>
              </div>

              {/* Detailed Issues */}
              {healthResults.issues.total > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {healthResults.issues.missingImages > 0 && (
                    <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FEE2E2' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <AlertTriangle size={16} color="#DC2626" />
                        <strong style={{ fontSize: '0.9375rem' }}>Imágenes Faltantes</strong>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                        {healthResults.issues.missingImages} elemento(s) sin imagen
                      </div>
                    </div>
                  )}

                  {healthResults.issues.missingDescriptions > 0 && (
                    <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FEE2E2' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <AlertTriangle size={16} color="#DC2626" />
                        <strong style={{ fontSize: '0.9375rem' }}>Descripciones Faltantes</strong>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                        {healthResults.issues.missingDescriptions} elemento(s) sin descripción
                      </div>
                    </div>
                  )}

                  {healthResults.issues.recipesWithoutSteps > 0 && (
                    <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FEE2E2' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <AlertTriangle size={16} color="#DC2626" />
                        <strong style={{ fontSize: '0.9375rem' }}>Recetas sin Pasos</strong>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                        {healthResults.issues.recipesWithoutSteps} receta(s) sin pasos de preparación
                      </div>
                    </div>
                  )}

                  {healthResults.issues.orphanRelations.total > 0 && (
                    <div style={{ padding: '1rem', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FEE2E2' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <AlertTriangle size={16} color="#DC2626" />
                        <strong style={{ fontSize: '0.9375rem' }}>Relaciones Huérfanas</strong>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                        fruit_regions: {healthResults.issues.orphanRelations.fruitRegions} |
                        recipe_fruits: {healthResults.issues.orphanRelations.recipeFruits}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {healthResults.issues.total === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', background: '#F0FDF4', borderRadius: '8px', border: '2px solid #BBF7D0' }}>
                  <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 1rem' }} />
                  <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', marginBottom: '0.5rem' }}>
                    ¡Sistema Saludable!
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    No se encontraron problemas
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
