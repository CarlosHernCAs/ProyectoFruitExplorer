import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Registrar nuevo usuario
export const register = async (req, res) => {
  const { email, password, display_name } = req.body;

  try {
    // 1. Verificar si ya existe
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ mensaje: 'El usuario ya está registrado' });
    }

    // 2. Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // 3. Crear usuario
    await pool.query(
      `INSERT INTO users (id, email, password_hash, display_name, preferences, created_at, consent_tracking, location_permission)
       VALUES (?, ?, ?, ?, '{}', NOW(), 0, 0)`,
      [userId, email, hashedPassword, display_name]
    );

    // 4. Verificar existencia de roles base
    const [roles] = await pool.query('SELECT COUNT(*) AS count FROM roles');
    if (roles[0].count === 0) {
      await pool.query("INSERT INTO roles (name) VALUES ('admin'), ('user')");
      console.log('Roles base creados automáticamente');
    }

    // 5. Obtener ID del rol "user"
    const [roleUser] = await pool.query('SELECT id FROM roles WHERE name = ?', ['user']);
    const roleId = roleUser[0].id;

    // 6. Asignar rol por defecto
    await pool.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [userId, roleId]
    );

    // 7. Crear token JWT
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario: {
        id: userId,
        email,
        display_name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user.id,
        email: user.email,
        display_name: user.display_name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};
