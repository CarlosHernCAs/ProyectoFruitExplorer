import { Router } from 'express';
import {
  createRole,
  listRoles,
  assignRoleToUser,
  removeRoleFromUser,
  deleteRole
} from '../controllers/role.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Solo admin
router.post('/', requireAuth, requireRole('admin'), createRole);
router.get('/', requireAuth, requireRole('admin'), listRoles);
router.post('/assign', requireAuth, requireRole('admin'), assignRoleToUser);
router.post('/remove', requireAuth, requireRole('admin'), removeRoleFromUser);
router.delete('/:id', requireAuth, requireRole('admin'), deleteRole);

export default router;
