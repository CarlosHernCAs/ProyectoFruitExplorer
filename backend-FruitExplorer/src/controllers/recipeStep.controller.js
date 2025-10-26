import pool from '../config/db.js';

// Listar pasos de una receta
export const listStepsByRecipe = async (req, res) => {
  try {
    const { recipe_id } = req.params;
    const [steps] = await pool.query(
      'SELECT id, step_number, description FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number ASC',
      [recipe_id]
    );
    res.status(200).json({ pasos: steps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener pasos de receta' });
  }
};

// Crear paso de receta (solo admin)
export const createStep = async (req, res) => {
  try {
    const { recipe_id } = req.params;
    const { step_number, description } = req.body;

    if (!step_number || !description)
      return res.status(400).json({ mensaje: 'step_number y description son obligatorios' });

    await pool.query(
      'INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES (?, ?, ?)',
      [recipe_id, step_number, description]
    );

    res.status(201).json({ mensaje: 'Paso agregado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al agregar paso' });
  }
};

// Actualizar paso (solo admin)
export const updateStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const [result] = await pool.query(
      'UPDATE recipe_steps SET description = ? WHERE id = ?',
      [description, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Paso no encontrado' });
    res.status(200).json({ mensaje: 'Paso actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar paso' });
  }
};

// Eliminar paso (solo admin)
export const deleteStep = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM recipe_steps WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Paso no encontrado' });

    res.status(200).json({ mensaje: 'Paso eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar paso' });
  }
};
