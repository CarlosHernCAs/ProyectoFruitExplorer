import api from '../api/axios';

/**
 * Servicio de autenticación
 */

/**
 * Registrar un nuevo usuario
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Iniciar sesión
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Cerrar sesión
 */
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    throw error.response?.data || error;
  }
};

/**
 * Obtener perfil del usuario actual
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  register,
  login,
  logout,
  getProfile,
};
