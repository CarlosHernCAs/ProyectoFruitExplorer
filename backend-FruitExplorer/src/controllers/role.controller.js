import pool from '../config/db.js';

// Crear un nuevo rol (solo admin)
export const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ mensaje: 'El nombre del rol es obligatorio' });

    const [exists] = await pool.query('SELECT id FROM roles WHERE name = ?', [name]);
    if (exists.length > 0) return res.status(400).json({ mensaje: 'El rol ya existe' });

    const [result] = await pool.query('INSERT INTO roles (name) VALUES (?)', [name]);
    res.status(201).json({ mensaje: 'Rol creado correctamente', id: result.insertId, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear el rol' });
  }
};

// Listar todos los roles
export const listRoles = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM roles ORDER BY id ASC');
    res.status(200).json({ roles: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al listar roles' });
  }
};

// Asignar un rol a un usuario (solo admin)
export const assignRoleToUser = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;
    if (!user_id || !role_id)
      return res.status(400).json({ mensaje: 'user_id y role_id son obligatorios' });

    await pool.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE role_id = VALUES(role_id)',
      [user_id, role_id]
    );

    res.status(200).json({ mensaje: 'Rol asignado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al asignar rol' });
  }
};

// Eliminar rol de un usuario (solo admin)
export const removeRoleFromUser = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;
    if (!user_id || !role_id)
      return res.status(400).json({ mensaje: 'user_id y role_id son obligatorios' });

    const [result] = await pool.query(
      'DELETE FROM user_roles WHERE user_id = ? AND role_id = ?',
      [user_id, role_id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: 'El usuario no tenía ese rol' });

    res.status(200).json({ mensaje: 'Rol eliminado del usuario' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar rol del usuario' });
  }
};

// Eliminar un rol del sistema (solo admin)
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const [used] = await pool.query('SELECT * FROM user_roles WHERE role_id = ?', [id]);
    if (used.length > 0) {
      return res.status(400).json({ mensaje: 'No se puede eliminar un rol asignado a usuarios' });
    }

    const [result] = await pool.query('DELETE FROM roles WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Rol no encontrado' });

    res.status(200).json({ mensaje: 'Rol eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar rol' });
  }
};
