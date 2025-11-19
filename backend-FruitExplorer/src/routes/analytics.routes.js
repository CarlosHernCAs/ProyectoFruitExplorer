import express from 'express';
import {
  getTrends,
  getActivityHeatmap,
  getUserEngagement,
  getContentHealth,
  getGrowthProjection
} from '../controllers/analytics.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// Todas las rutas de analytics requieren autenticación de admin
router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/trends', getTrends);
router.get('/activity-heatmap', getActivityHeatmap);
router.get('/user-engagement', getUserEngagement);
router.get('/content-health', getContentHealth);
router.get('/growth-projection', getGrowthProjection);

export default router;
