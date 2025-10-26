import { Router } from 'express';
import {
  listFruits,
  getFruitById,
  getFruitBySlug,
  createFruit,
  updateFruit,
  deleteFruit,
  markSynced
} from '../controllers/fruit.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Public
router.get('/', listFruits);
router.get('/slug/:slug', getFruitBySlug);
router.get('/:id', getFruitById);

// Protected admin
router.post('/', requireAuth, requireRole('admin'), createFruit);
router.put('/:id', requireAuth, requireRole('admin'), updateFruit);
router.delete('/:id', requireAuth, requireRole('admin'), deleteFruit);

// Sync endpoint
router.post('/:id/sync', requireAuth, requireRole('admin'), markSynced);

export default router;
