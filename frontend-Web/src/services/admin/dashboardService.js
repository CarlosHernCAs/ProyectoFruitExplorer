import { apiFetch } from '../apiFetch';

// =========================================
// DASHBOARD SERVICE
// =========================================

/**
 * Obtiene estadísticas básicas del dashboard
 */
export const getBasicStats = () => {
  return apiFetch('/dashboard/stats');
};

/**
 * Obtiene overview del dashboard principal
 */
export const getOverview = () => {
  return apiFetch('/dashboard/overview');
};

/**
 * Obtiene actividad reciente
 */
export const getRecentActivity = (limit = 20) => {
  return apiFetch(`/dashboard/activity?limit=${limit}`);
};

/**
 * Obtiene estadísticas detalladas de frutas
 */
export const getFruitStats = () => {
  return apiFetch('/dashboard/fruits/stats');
};

/**
 * Obtiene estadísticas detalladas de recetas
 */
export const getRecipeStats = () => {
  return apiFetch('/dashboard/recipes/stats');
};

/**
 * Obtiene estadísticas detalladas de usuarios
 */
export const getUserStats = () => {
  return apiFetch('/dashboard/users/stats');
};

/**
 * Obtiene estadísticas detalladas de regiones
 */
export const getRegionStats = () => {
  return apiFetch('/dashboard/regions/stats');
};
