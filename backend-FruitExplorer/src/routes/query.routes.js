import { Router } from 'express';
import { logQuery, updateQueryVoiceStatus } from '../controllers/query.controller.js';
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

/**
 * @swagger
 * /api/queries/{id}/voice:
 *   put:
 *     summary: Actualiza una consulta para registrar el uso de voz.
 *     description: Marca como 'true' el campo voice_enabled de una consulta existente. Requiere autenticación.
 */
router.put('/:id/voice', requireAuth, updateQueryVoiceStatus);

export default router;