import { apiFetch } from '../apiFetch';

// =========================================
// ADMIN SERVICE
// =========================================

// ========== BULK OPERATIONS ==========

/**
 * Elimina múltiples frutas
 */
export const bulkDeleteFruits = (ids) => {
  return apiFetch('/admin/bulk/delete-fruits', {
    method: 'POST',
    body: JSON.stringify({ ids })
  });
};

/**
 * Elimina múltiples recetas
 */
export const bulkDeleteRecipes = (ids) => {
  return apiFetch('/admin/bulk/delete-recipes', {
    method: 'POST',
    body: JSON.stringify({ ids })
  });
};

/**
 * Asigna una región a múltiples frutas
 */
export const bulkAssignRegion = (fruitIds, regionId) => {
  return apiFetch('/admin/bulk/assign-region', {
    method: 'POST',
    body: JSON.stringify({ fruitIds, regionId })
  });
};

/**
 * Asigna un rol a múltiples usuarios
 */
export const bulkAssignRole = (userIds, roleId) => {
  return apiFetch('/admin/bulk/assign-role', {
    method: 'POST',
    body: JSON.stringify({ userIds, roleId })
  });
};

// ========== EXPORTACIÓN ==========

/**
 * Exporta frutas en formato especificado
 */
export const exportFruits = async (format = 'json') => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/admin/export/fruits?format=${format}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al exportar frutas');
  }

  if (format === 'csv') {
    const blob = await response.blob();
    return blob;
  }

  return await response.json();
};

/**
 * Exporta recetas en formato especificado
 */
export const exportRecipes = async (format = 'json') => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/admin/export/recipes?format=${format}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al exportar recetas');
  }

  if (format === 'csv') {
    const blob = await response.blob();
    return blob;
  }

  return await response.json();
};

/**
 * Exporta usuarios en formato especificado
 */
export const exportUsers = async (format = 'json') => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/admin/export/users?format=${format}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al exportar usuarios');
  }

  if (format === 'csv') {
    const blob = await response.blob();
    return blob;
  }

  return await response.json();
};

/**
 * Exporta regiones en formato especificado
 */
export const exportRegions = async (format = 'json') => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/admin/export/regions?format=${format}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al exportar regiones');
  }

  if (format === 'csv') {
    const blob = await response.blob();
    return blob;
  }

  return await response.json();
};

/**
 * Trigger de descarga de archivo
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// ========== MANTENIMIENTO ==========

/**
 * Ejecuta health check del sistema
 */
export const healthCheck = () => {
  return apiFetch('/admin/health-check');
};

/**
 * Limpia registros huérfanos
 */
export const fixOrphans = () => {
  return apiFetch('/admin/fix-orphans', {
    method: 'POST'
  });
};
