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

router.post(
  '/fruit',
  uploadSingleImage,
  handleUploadError,
  reconocerFruta
);

router.post('/nutrition', obtenerInfoNutricional);

router.post(
  '/fruit/auth',
  requireAuth,
  uploadSingleImage,
  handleUploadError,
  reconocerFruta
);

export default router;
