import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request - Agregar token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Response - Manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${status}`);

      // Manejar errores específicos
      switch (status) {
        case 401:
          // Token inválido o expirado
          console.warn('⚠️ Sesión expirada. Redirigiendo a login...');
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          window.location.href = '/login';
          break;

        case 403:
          console.warn('⚠️ No tienes permisos para esta acción');
          break;

        case 404:
          console.warn('⚠️ Recurso no encontrado');
          break;

        case 500:
          console.error('❌ Error interno del servidor');
          break;

        default:
          console.error(`❌ Error ${status}:`, data?.message || 'Error desconocido');
      }

      return Promise.reject(error);
    } else if (error.request) {
      // Request se hizo pero no hay respuesta
      console.error('❌ No hay respuesta del servidor. Verifica tu conexión.');
      return Promise.reject(new Error('Sin conexión al servidor'));
    } else {
      // Error al configurar el request
      console.error('❌ Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;
