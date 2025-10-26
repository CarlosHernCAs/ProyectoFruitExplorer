import { Router } from 'express';
import {
  listStepsByRecipe,
  createStep,
  updateStep,
  deleteStep
} from '../controllers/recipeStep.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Público
router.get('/:recipe_id', listStepsByRecipe);

// Admin
router.post('/:recipe_id', requireAuth, requireRole('admin'), createStep);
router.put('/:id', requireAuth, requireRole('admin'), updateStep);
router.delete('/:id', requireAuth, requireRole('admin'), deleteStep);

export default router;
