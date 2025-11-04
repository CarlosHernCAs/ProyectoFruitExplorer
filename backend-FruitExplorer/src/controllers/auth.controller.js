import { registerUser, loginUser } from '../services/auth.service.js';

// Registrar nuevo usuario
export const register = async (req, res) => {
  const { email, password, display_name } = req.body;

  try {
    const result = await registerUser(email, password, display_name);
    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      ...result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: err.message });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      ...result
    });
  } catch (err) {
    console.error(err);
    if (err.message === 'Usuario no encontrado') {
      return res.status(404).json({ mensaje: err.message });
    }
    if (err.message === 'Contraseña incorrecta') {
      return res.status(401).json({ mensaje: err.message });
    }
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};
