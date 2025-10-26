import { Router } from 'express';
import {
  listRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from '../controllers/recipe.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Público
router.get('/', listRecipes);
router.get('/:id', getRecipeById);

// Admin
router.post('/', requireAuth, requireRole('admin'), createRecipe);
router.put('/:id', requireAuth, requireRole('admin'), updateRecipe);
router.delete('/:id', requireAuth, requireRole('admin'), deleteRecipe);

export default router;
