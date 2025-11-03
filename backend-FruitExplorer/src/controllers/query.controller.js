import pool from '../config/db.js';

/**
 * Registra una nueva consulta de detección de fruta en la base de datos.
 * Espera recibir el nombre de la fruta (slug) en el cuerpo de la solicitud.
 * El ID del usuario se obtiene del token de autenticación.
 */
export const logQuery = async (req, res) => {
  // El ID del usuario lo inyecta el middleware requireAuth
  const userId = req.user.id;
  const { fruitName, location, usedTextToSpeech } = req.body;

  if (!fruitName) {
    return res.status(400).json({ mensaje: 'El nombre de la fruta (fruitName) es obligatorio.' });
  }

  try {
    // 1. Buscar el ID de la fruta usando su 'slug' (que es lo que nos llega como fruitName)
    const [fruitRows] = await pool.query('SELECT id FROM fruits WHERE slug = ?', [fruitName]);

    if (fruitRows.length === 0) {
      // Si la fruta no existe en la BD, no podemos registrar la consulta.
      // Podríamos decidir registrarla con un fruit_id nulo si quisiéramos guardar detecciones fallidas.
      return res.status(404).json({ mensaje: 'La fruta detectada no se encuentra en la base de datos.' });
    }

    const fruitId = fruitRows[0].id;

    // 2. Insertar el registro en la tabla 'queries'
    // Asumimos que la tabla 'queries' tiene estas columnas.
    // La ubicación se puede mejorar para guardar latitud y longitud por separado.
    // Ajustamos los nombres de las columnas para que coincidan con el archivo .sql
    await pool.query(
      `INSERT INTO queries (user_id, fruit_id, location, voice_enabled, detected_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, fruitId, location || null, usedTextToSpeech || false]
    );

    res.status(201).json({ mensaje: 'Consulta registrada correctamente.' });

  } catch (err) {
    console.error('Error al registrar la consulta:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor al registrar la consulta.' });
  }
};