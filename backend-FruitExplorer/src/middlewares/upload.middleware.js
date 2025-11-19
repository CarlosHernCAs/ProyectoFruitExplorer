import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
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

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadSingleImage = upload.single('imagen');

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
