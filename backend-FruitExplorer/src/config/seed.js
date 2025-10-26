import pool from './db.js';
import { v4 as uuidv4 } from 'uuid';

export const initRoles = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM roles');
  if (rows[0].total === 0) {
    await pool.query('INSERT INTO roles (name) VALUES (?)', ['admin']);
    await pool.query('INSERT INTO roles (name) VALUES (?)', ['user']);
    console.log('✅ Roles iniciales creados');
  }
};
