import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import fruitRoutes from './fruit.routes.js';
import roleRoutes from './role.routes.js';
import recipeRoutes from './recipe.routes.js';
import recipeStepRoutes from './recipeStep.routes.js';
import regionRoutes from './region.routes.js';
import fruitRecipeRoutes from './fruitRecipe.routes.js';
import queryRoutes from './query.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import analyticsRoutes from './analytics.routes.js';
import adminRoutes from './admin.routes.js';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/fruits', fruitRoutes);
router.use('/roles', roleRoutes);
router.use('/recipes', recipeRoutes);
router.use('/steps', recipeStepRoutes);
router.use('/regions', regionRoutes);
router.use('/fruit-recipes', fruitRecipeRoutes);
router.use('/queries', queryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
