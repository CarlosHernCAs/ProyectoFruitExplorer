import express from 'express';
import {
  bulkDeleteFruits,
  bulkDeleteRecipes,
  bulkAssignRegion,
  bulkAssignRole,
  exportFruits,
  exportRecipes,
  exportUsers,
  healthCheck,
  fixOrphans
} from '../controllers/admin.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// Todas las rutas de admin requieren autenticación de admin
router.use(requireAuth);
router.use(requireRole('admin'));

// Operaciones en bulk
router.post('/bulk/delete-fruits', bulkDeleteFruits);
router.post('/bulk/delete-recipes', bulkDeleteRecipes);
router.post('/bulk/assign-region', bulkAssignRegion);
router.post('/bulk/assign-role', bulkAssignRole);

// Exportación
router.get('/export/fruits', exportFruits);
router.get('/export/recipes', exportRecipes);
router.get('/export/users', exportUsers);

// Mantenimiento
router.get('/health-check', healthCheck);
router.post('/fix-orphans', fixOrphans);

export default router;
