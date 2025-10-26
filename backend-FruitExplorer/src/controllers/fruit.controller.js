import pool from '../config/db.js';

// Listar frutas con filtros: region, q (texto), page, limit
export const listFruits = async (req, res) => {
  try {
    const { region, q, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let baseQuery = `SELECT f.id, f.slug, f.common_name, f.scientific_name,
                            f.description, f.image_url, f.source_api_url, f.last_synced_at, f.created_at
                     FROM fruits f`;
    const params = [];

    if (region) {
      baseQuery += ` JOIN fruit_regions fr ON fr.fruit_id = f.id
                     JOIN regions r ON r.id = fr.region_id`;
    }

    let where = '';
    if (q) {
      where = ' WHERE (f.common_name LIKE ? OR f.scientific_name LIKE ? OR f.description LIKE ?)';
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    if (region) {
      where += where ? ' AND r.name = ?' : ' WHERE r.name = ?';
      params.push(region);
    }

    const limitOffset = ' ORDER BY f.common_name ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(baseQuery + where + limitOffset, params);
    res.status(200).json({ frutas: rows });
  } catch (err) {
    console.error('Error listFruits', err);
    res.status(500).json({ mensaje: 'Error al obtener frutas' });
  }
};

// Obtener fruta por id
export const getFruitById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT id, slug, common_name, scientific_name, description, nutritional,
              image_url, source_api_url, last_synced_at, synced_by, created_at
       FROM fruits WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ mensaje: 'Fruta no encontrada' });

    res.status(200).json({ fruta: rows[0] });
  } catch (err) {
    console.error('Error getFruitById', err);
    res.status(500).json({ mensaje: 'Error al obtener la fruta' });
  }
};

// Obtener fruta por slug
export const getFruitBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      `SELECT id, slug, common_name, scientific_name, description, nutritional,
              image_url, source_api_url, last_synced_at, synced_by, created_at
       FROM fruits WHERE slug = ?`,
      [slug]
    );

    if (rows.length === 0) return res.status(404).json({ mensaje: 'Fruta no encontrada' });

    res.status(200).json({ fruta: rows[0] });
  } catch (err) {
    console.error('Error getFruitBySlug', err);
    res.status(500).json({ mensaje: 'Error al obtener la fruta' });
  }
};

// Crear fruta (admin)
export const createFruit = async (req, res) => {
  try {
    const { slug, common_name, scientific_name, description, nutritional, image_url, source_api_url } = req.body;

    if (!slug || !common_name) {
      return res.status(400).json({ mensaje: 'slug y common_name son obligatorios' });
    }

    const [exists] = await pool.query('SELECT id FROM fruits WHERE slug = ?', [slug]);
    if (exists.length > 0) return res.status(400).json({ mensaje: 'Slug ya existe' });

    const [result] = await pool.query(
      `INSERT INTO fruits (slug, common_name, scientific_name, description, nutritional, image_url, source_api_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [slug, common_name, scientific_name || null, description || null, JSON.stringify(nutritional || {}), image_url || null, source_api_url || null]
    );

    const insertId = result.insertId;
    const [newRow] = await pool.query('SELECT * FROM fruits WHERE id = ?', [insertId]);

    res.status(201).json({ mensaje: 'Fruta creada', fruta: newRow[0] });
  } catch (err) {
    console.error('Error createFruit', err);
    res.status(500).json({ mensaje: 'Error al crear la fruta' });
  }
};

// Actualizar fruta (admin)
export const updateFruit = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = ['slug', 'common_name', 'scientific_name', 'description', 'nutritional', 'image_url', 'source_api_url'];
    const updates = [];
    const params = [];

    for (const f of fields) {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = ?`);
        if (f === 'nutritional') params.push(JSON.stringify(req.body[f]));
        else params.push(req.body[f]);
      }
    }

    if (updates.length === 0) return res.status(400).json({ mensaje: 'No hay campos para actualizar' });

    params.push(id);
    const sql = `UPDATE fruits SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await pool.query(sql, params);

    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Fruta no encontrada' });

    const [rows] = await pool.query('SELECT * FROM fruits WHERE id = ?', [id]);
    res.status(200).json({ mensaje: 'Fruta actualizada', fruta: rows[0] });
  } catch (err) {
    console.error('Error updateFruit', err);
    res.status(500).json({ mensaje: 'Error al actualizar la fruta' });
  }
};

// Eliminar fruta (admin)
export const deleteFruit = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM fruits WHERE id = ?', [id]);

    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Fruta no encontrada' });

    res.status(200).json({ mensaje: 'Fruta eliminada' });
  } catch (err) {
    console.error('Error deleteFruit', err);
    res.status(500).json({ mensaje: 'Error al eliminar la fruta' });
  }
};

// Marcar sincronización del catálogo
export const markSynced = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;

    const [result] = await pool.query(
      'UPDATE fruits SET last_synced_at = NOW(), synced_by = ? WHERE id = ?',
      [userId, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Fruta no encontrada' });

    res.status(200).json({ mensaje: 'Fruta marcada como sincronizada' });
  } catch (err) {
    console.error('Error markSynced', err);
    res.status(500).json({ mensaje: 'Error al actualizar sincronización' });
  }
};
