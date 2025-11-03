import { Router } from 'express';
import { logQuery } from '../controllers/query.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/queries/log:
 *   post:
 *     summary: Registra una consulta de detección de fruta.
 *     description: Guarda un registro de la fruta que un usuario ha detectado. Requiere autenticación.
 */
router.post('/log', requireAuth, logQuery);

export default router;