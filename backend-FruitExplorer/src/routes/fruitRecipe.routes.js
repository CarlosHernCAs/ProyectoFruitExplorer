import { Router } from 'express';
import {
  addFruitRecipe,
  listRecipesByFruit,
  listFruitsByRecipe,
  removeFruitRecipe
} from '../controllers/fruitRecipe.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Solo admin crea o elimina asociaciones
router.post('/', requireAuth, requireRole('admin'), addFruitRecipe);
router.delete('/', requireAuth, requireRole('admin'), removeFruitRecipe);

// Esta ruta ahora es manejada por /api/fruits/:id/recipes para seguir un mejor patrón REST.
// router.get('/by-fruit/:fruit_id', listRecipesByFruit); 
router.get('/by-recipe/:recipe_id', listFruitsByRecipe);

export default router;
