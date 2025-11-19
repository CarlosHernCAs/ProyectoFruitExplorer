import express from 'express';
import {
  getBasicStats,
  getOverview,
  getRecentActivity,
  getFruitStats,
  getRecipeStats,
  getUserStats,
  getRegionStats
} from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// Todas las rutas de dashboard requieren autenticación de admin
router.use(requireAuth);
router.use(requireRole('admin'));

// Estadísticas básicas
router.get('/stats', getBasicStats);
router.get('/overview', getOverview);
router.get('/activity', getRecentActivity);

// Estadísticas por módulo
router.get('/fruits/stats', getFruitStats);
router.get('/recipes/stats', getRecipeStats);
router.get('/users/stats', getUserStats);
router.get('/regions/stats', getRegionStats);

export default router;
