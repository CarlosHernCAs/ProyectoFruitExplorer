import { Router } from 'express';
import {
  createRegion,
  listRegions,
  getRegionById,
  updateRegion,
  deleteRegion,
  getFruitsByRegion
} from '../controllers/region.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Solo admin puede crear, editar o eliminar
router.post('/', requireAuth, requireRole('admin'), createRegion);
router.put('/:id', requireAuth, requireRole('admin'), updateRegion);
router.delete('/:id', requireAuth, requireRole('admin'), deleteRegion);

// Rutas públicas para ver regiones
router.get('/', listRegions);
router.get('/:id', getRegionById);

// Ruta para obtener las frutas de una región específica
router.get('/:id/fruits', getFruitsByRegion);

export default router;
