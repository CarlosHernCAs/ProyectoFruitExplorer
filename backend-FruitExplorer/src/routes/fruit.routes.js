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
import { listRecipesByFruit } from '../controllers/fruitRecipe.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Public
router.get('/', listFruits);
router.get('/slug/:slug', getFruitBySlug);
router.get('/:id', getFruitById);
// Nueva ruta para obtener las recetas de una fruta
// Usa el controlador de fruitRecipe, pero se accede desde la ruta de la fruta
router.get('/:id/recipes', listRecipesByFruit);

// Protected admin
router.post('/', requireAuth, requireRole('admin'), createFruit);
router.put('/:id', requireAuth, requireRole('admin'), updateFruit);
router.delete('/:id', requireAuth, requireRole('admin'), deleteFruit);

// Sync endpoint
router.post('/:id/sync', requireAuth, requireRole('admin'), markSynced);


export default router;
