import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  assignRole,
  removeRole,
  updateUserRole
} from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Rutas protegidas
router.get('/', requireAuth, requireRole('admin'), getAllUsers);
router.get('/:id', requireAuth, getUserById);
router.put('/update', requireAuth, updateProfile);
router.delete('/:id', requireAuth, requireRole('admin'), deleteUser);
router.post('/assign-role', requireAuth, requireRole('admin'), assignRole);
router.post('/remove-role', requireAuth, requireRole('admin'), removeRole);
router.put('/update-role', requireAuth, requireRole('admin'), updateUserRole);

export default router;
