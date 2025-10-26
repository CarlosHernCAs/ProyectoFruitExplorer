import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../utils/hash.js';

// Listar todos los usuarios (solo admin)
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, display_name, created_at, last_login FROM users'
    );
    res.status(200).json({ usuarios: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al listar usuarios' });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT id, email, display_name, created_at, last_login FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ usuario: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener usuario' });
  }
};

// Actualizar perfil del usuario autenticado
export const updateProfile = async (req, res) => {
  const { display_name, password } = req.body;
  const userId = req.user.id;

  try {
    let query = 'UPDATE users SET';
    const params = [];

    if (display_name) {
      query += ' display_name = ?';
      params.push(display_name);
    }

    if (password) {
      const hashed = await hashPassword(password);
      query += params.length ? ', password_hash = ?' : ' password_hash = ?';
      params.push(hashed);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    await pool.query(query, params);

    res.status(200).json({ mensaje: 'Perfil actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar perfil' });
  }
};

// Eliminar usuario (solo admin)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
};

// Asignar rol a usuario (solo admin)
export const assignRole = async (req, res) => {
  const { user_id, role_id } = req.body;

  try {
    await pool.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [user_id, role_id]
    );
    res.status(200).json({ mensaje: 'Rol asignado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al asignar rol' });
  }
};

// Quitar rol a usuario (solo admin)
export const removeRole = async (req, res) => {
  const { user_id, role_id } = req.body;

  try {
    const [result] = await pool.query(
      'DELETE FROM user_roles WHERE user_id = ? AND role_id = ?',
      [user_id, role_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'No se encontró el rol para ese usuario' });
    }

    res.status(200).json({ mensaje: 'Rol eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar rol' });
  }
};
