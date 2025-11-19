import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const registerUser = async (email, password, display_name) => {
//Verificar si ya existe
  const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new Error('El usuario ya está registrado');
  }

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  //Crear usuario
  await pool.query(
    `INSERT INTO users (id, email, password_hash, display_name, preferences, created_at, consent_tracking, location_permission)
     VALUES (?, ?, ?, ?, '{}', NOW(), 0, 0)`,
    [userId, email, hashedPassword, display_name]
  );

  //Verificar existencia de roles base
  const [roles] = await pool.query('SELECT COUNT(*) AS count FROM roles');
  if (roles[0].count === 0) {
    await pool.query("INSERT INTO roles (name) VALUES ('admin'), ('user')");
    console.log('Roles base creados automáticamente');
  }

  //Obtener ID del rol "user"
  const [roleUser] = await pool.query('SELECT id FROM roles WHERE name = ?', ['user']);
  const roleId = roleUser[0].id;

  // Asignar rol por defecto
  await pool.query(
    'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
    [userId, roleId]
  );

  // Crear token JWT con rol
  const token = jwt.sign({ id: userId, email, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    usuario: {
      id: userId,
      email,
      display_name,
      role: 'user'  // ✅ Incluir el rol por defecto en el registro
    }
  };
};

export const loginUser = async (email, password) => {
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const user = users[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw new Error('Contraseña incorrecta');
  }

  // 🔑 Obtener el rol del usuario
  const [userRoles] = await pool.query(
    `SELECT r.name as role_name
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ?
     LIMIT 1`,
    [user.id]
  );

  const role = userRoles.length > 0 ? userRoles[0].role_name : 'user';

  await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

  const token = jwt.sign(
    { id: user.id, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    usuario: {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      role: role  // ✅ Incluir el rol en la respuesta
    }
  };
};
