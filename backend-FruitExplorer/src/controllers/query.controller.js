import pool from '../config/db.js';

/**
 * Registra una nueva consulta de detección de fruta en la base de datos.
 * Espera recibir el nombre de la fruta (slug) en el cuerpo de la solicitud.
 * El ID del usuario se obtiene del token de autenticación.
 */
export const logQuery = async (req, res) => {
  // El ID del usuario lo inyecta el middleware requireAuth
  const userId = req.user.id;
  // CORRECCIÓN: Leemos los nuevos campos del cuerpo de la solicitud
  const { fruitName, location, confidence, modelId } = req.body;

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
    // CORRECCIÓN: Añadimos las nuevas columnas a la consulta INSERT
    const [result] = await pool.query(
      `INSERT INTO queries (user_id, fruit_id, confidence, model_id, detected_name, location, voice_enabled, detected_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [userId, fruitId, confidence || null, modelId || null, fruitName, location || null, false]
    );

    res.status(201).json({
      mensaje: 'Consulta registrada correctamente.',
      queryId: result.insertId // Devolvemos el ID de la fila recién creada
    });

  } catch (err) {
    console.error('Error al registrar la consulta:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor al registrar la consulta.' });
  }
};

/**
 * Actualiza una consulta existente para marcar que se usó el texto a voz.
 */
export const updateQueryVoiceStatus = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Asegurarnos que el usuario solo actualiza sus propias consultas

  try {
    const [result] = await pool.query(
      'UPDATE queries SET voice_enabled = true WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'No se encontró la consulta o no tienes permiso para actualizarla.' });
    }

    res.status(200).json({ mensaje: 'Consulta actualizada correctamente.' });
  } catch (err) {
    console.error('Error al actualizar la consulta:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor al actualizar la consulta.' });
  }
};