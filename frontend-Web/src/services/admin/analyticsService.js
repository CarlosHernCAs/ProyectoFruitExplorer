import { apiFetch } from '../apiFetch';

// =========================================
// ANALYTICS SERVICE
// =========================================

/**
 * Obtiene tendencias de crecimiento
 */
export const getTrends = (period = '30d') => {
  return apiFetch(`/analytics/trends?period=${period}`);
};

/**
 * Obtiene datos para heatmap de actividad
 */
export const getActivityHeatmap = () => {
  return apiFetch('/analytics/activity-heatmap');
};

/**
 * Obtiene métricas de engagement de usuarios
 */
export const getUserEngagement = () => {
  return apiFetch('/analytics/user-engagement');
};

/**
 * Obtiene score de salud del contenido
 */
export const getContentHealth = () => {
  return apiFetch('/analytics/content-health');
};

/**
 * Obtiene proyección de crecimiento
 */
export const getGrowthProjection = () => {
  return apiFetch('/analytics/growth-projection');
};
