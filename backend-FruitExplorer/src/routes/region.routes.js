import { Router } from 'express';
import {
  createRegion,
  listRegions,
  getRegionById,
  updateRegion,
  deleteRegion
} from '../controllers/region.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Solo admin puede crear, editar o eliminar
router.post('/', requireAuth, requireRole('admin'), createRegion);
router.put('/:id', requireAuth, requireRole('admin'), updateRegion);
router.delete('/:id', requireAuth, requireRole('admin'), deleteRegion);

// Usuarios autenticados pueden ver las regiones
router.get('/', requireAuth, listRegions);
router.get('/:id', requireAuth, getRegionById);

export default router;
