import pool from '../config/db.js';

// Asociar fruta con receta (solo admin)
export const addFruitRecipe = async (req, res) => {
  try {
    const { fruit_id, recipe_id } = req.body;

    if (!fruit_id || !recipe_id)
      return res.status(400).json({ mensaje: 'fruit_id y recipe_id son obligatorios' });

    await pool.query(
      `INSERT INTO fruit_recipes (fruit_id, recipe_id)
       VALUES (?, ?) ON DUPLICATE KEY UPDATE fruit_id = VALUES(fruit_id)`,
      [fruit_id, recipe_id]
    );

    res.status(201).json({ mensaje: 'Fruta asociada a receta correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al asociar fruta con receta' });
  }
};

// Listar recetas asociadas a una fruta
export const listRecipesByFruit = async (req, res) => {
  try {
    // CORRECCIÓN: El parámetro de la ruta es 'id', no 'fruit_id'.
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT r.id, r.title, r.description, r.image_url
       FROM recipes r
       JOIN fruit_recipes fr ON r.id = fr.recipe_id
       WHERE fr.fruit_id = ?
       ORDER BY r.title ASC`,
      [id] // Usamos el parámetro 'id' correcto.
    );

    res.status(200).json({ recipes: rows }); // CORRECCIÓN: Devolvemos la clave "recipes" para coincidir con el frontend.
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener recetas por fruta' });
  }
};

// Listar frutas asociadas a una receta
export const listFruitsByRecipe = async (req, res) => {
  try {
    const { recipe_id } = req.params;

    const [rows] = await pool.query(
      `SELECT f.id, f.common_name, f.image_url
       FROM fruits f
       JOIN fruit_recipes fr ON f.id = fr.fruit_id
       WHERE fr.recipe_id = ?
       ORDER BY f.common_name ASC`,
      [recipe_id]
    );

    res.status(200).json({ frutas: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener frutas por receta' });
  }
};

// Eliminar asociación fruta-receta (solo admin)
export const removeFruitRecipe = async (req, res) => {
  try {
    const { fruit_id, recipe_id } = req.body;

    const [result] = await pool.query(
      'DELETE FROM fruit_recipes WHERE fruit_id = ? AND recipe_id = ?',
      [fruit_id, recipe_id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'No existía esa asociación' });

    res.status(200).json({ mensaje: 'Asociación eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar asociación' });
  }
};
