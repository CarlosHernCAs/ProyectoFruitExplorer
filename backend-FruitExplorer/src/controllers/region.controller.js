import pool from '../config/db.js';

// Crear una nueva región
export const createRegion = async (req, res) => {
  try {
    const { name, description, image_url, geo_polygon } = req.body;

    if (!name) return res.status(400).json({ mensaje: 'El nombre de la región es obligatorio' });

    const [exists] = await pool.query('SELECT id FROM regions WHERE name = ?', [name]);
    if (exists.length > 0)
      return res.status(400).json({ mensaje: 'La región ya existe en el sistema' });

    const [result] = await pool.query(
      'INSERT INTO regions (name, description, image_url, geo_polygon) VALUES (?, ?, ?, ?)',
      [name, description, image_url, geo_polygon || null]
    );

    res.status(201).json({
      mensaje: 'Región creada correctamente',
      id: result.insertId,
      name,
      description,
      image_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear la región' });
  }
};

// Listar todas las regiones
export const listRegions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, description, image_url, geo_polygon FROM regions ORDER BY name ASC'
    );
    res.status(200).json({ regiones: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al listar las regiones' });
  }
};

// Obtener una región por ID
export const getRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, name, description, image_url, geo_polygon FROM regions WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ mensaje: 'Región no encontrada' });
    res.status(200).json({ region: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener la región' });
  }
};

// Actualizar una región
export const updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, geo_polygon } = req.body;

    const [result] = await pool.query(
      'UPDATE regions SET name = ?, description = ?, image_url = ?, geo_polygon = ? WHERE id = ?',
      [name, description, image_url, geo_polygon || null, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Región no encontrada para actualizar' });

    res.status(200).json({ mensaje: 'Región actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar la región' });
  }
};

// Eliminar una región
export const deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM regions WHERE id = ?', [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'Región no encontrada para eliminar' });

    res.status(200).json({ mensaje: 'Región eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar la región' });
  }
};
