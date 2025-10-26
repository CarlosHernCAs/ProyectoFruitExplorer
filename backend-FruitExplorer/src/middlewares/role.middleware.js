import pool from '../config/db.js';

export const requireRole = (roleName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const [roles] = await pool.query(
        `SELECT r.name FROM user_roles ur 
         JOIN roles r ON ur.role_id = r.id 
         WHERE ur.user_id = ?`,
        [userId]
      );

      const hasRole = roles.some(r => r.name === roleName);

      if (!hasRole) {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
      }

      next();
    } catch (err) {
      console.error('Error en middleware de rol:', err);
      res.status(500).json({ mensaje: 'Error interno' });
    }
  };
};
