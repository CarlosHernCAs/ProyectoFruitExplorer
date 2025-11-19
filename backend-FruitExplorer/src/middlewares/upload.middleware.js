import multer from 'multer';

/**
 * Configuración de Multer para subida de imágenes
 * Almacena las imágenes en memoria (buffer) para enviarlas directamente a OpenAI
 */

// Configurar almacenamiento en memoria
const storage = multer.memoryStorage();

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  // Tipos de imagen permitidos
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF, WEBP).'
      ),
      false
    );
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB
  },
});

/**
 * Middleware para subir una sola imagen
 * Campo del formulario: 'imagen'
 */
export const uploadSingleImage = upload.single('imagen');

/**
 * Middleware para manejar errores de Multer
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Archivo demasiado grande',
        mensaje: 'El tamaño máximo permitido es 5MB.',
      });
    }
    return res.status(400).json({
      error: 'Error al subir archivo',
      mensaje: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      error: 'Error de validación',
      mensaje: err.message,
    });
  }

  next();
};

export default upload;
