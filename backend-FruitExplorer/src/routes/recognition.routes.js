import { Router } from 'express';
import {
  reconocerFruta,
  obtenerInfoNutricional
} from '../controllers/recognition.controller.js';
import {
  uploadSingleImage,
  handleUploadError
} from '../middlewares/upload.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * Ruta pública para reconocer frutas desde una imagen
 * POST /api/recognition/fruit
 * Content-Type: multipart/form-data
 * Body: imagen (archivo de imagen)
 */
router.post(
  '/fruit',
  uploadSingleImage,
  handleUploadError,
  reconocerFruta
);

/**
 * Ruta pública para obtener información nutricional
 * POST /api/recognition/nutrition
 * Content-Type: application/json
 * Body: { nombreFruta: "nombre de la fruta" }
 */
router.post('/nutrition', obtenerInfoNutricional);

/**
 * Ruta protegida (requiere autenticación) para reconocer frutas
 * POST /api/recognition/fruit/auth
 */
router.post(
  '/fruit/auth',
  requireAuth,
  uploadSingleImage,
  handleUploadError,
  reconocerFruta
);

export default router;
