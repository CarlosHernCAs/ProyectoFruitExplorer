import pool from '../config/db.js';

// Listar todas las recetas (público)
export const listRecipes = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, title, description, source, image_url
      FROM recipes
    `;
    const params = [];

    if (q) {
      query += ' WHERE title LIKE ? OR description LIKE ?';
      const like = `%${q}%`;
      params.push(like, like);
    }

    query += ' ORDER BY title ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    res.status(200).json({ recipes: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al listar recetas' });
  }
};

// Obtener receta por ID (público)
export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM recipes WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Receta no encontrada' });

    const [steps] = await pool.query(
      'SELECT step_number, description FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number ASC',
      [id]
    );

    res.status(200).json({ receta: rows[0], pasos: steps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener la receta' });
  }
};

// Crear receta (solo admin)
export const createRecipe = async (req, res) => {
  try {
    const { title, description, source, image_url } = req.body;
    if (!title) return res.status(400).json({ mensaje: 'El título es obligatorio' });

    const [result] = await pool.query(
      'INSERT INTO recipes (title, description, source, image_url) VALUES (?, ?, ?, ?)',
      [title, description || null, source || null, image_url || null]
    );

    const [newRow] = await pool.query('SELECT * FROM recipes WHERE id = ?', [result.insertId]);
    res.status(201).json({ mensaje: 'Receta creada correctamente', receta: newRow[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear receta' });
  }
};

// Actualizar receta (solo admin)
export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = ['title', 'description', 'source', 'image_url'];
    const updates = [];
    const params = [];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    }

    if (updates.length === 0) return res.status(400).json({ mensaje: 'No hay campos para actualizar' });

    params.push(id);
    const sql = `UPDATE recipes SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await pool.query(sql, params);

    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Receta no encontrada' });

    const [rows] = await pool.query('SELECT * FROM recipes WHERE id = ?', [id]);
    res.status(200).json({ mensaje: 'Receta actualizada correctamente', receta: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar receta' });
  }
};

// Eliminar receta (solo admin)
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM recipes WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Receta no encontrada' });

    res.status(200).json({ mensaje: 'Receta eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar receta' });
  }
};
