import api from '../api/axios';

/**
 * Servicio para reconocimiento de frutas por imagen
 */

/**
 * Reconoce una fruta a partir de una imagen
 * @param {File} imageFile - Archivo de imagen (File object del input type="file")
 * @returns {Promise} - Promesa con los resultados del reconocimiento
 */
export const recognizeFruit = async (imageFile) => {
  try {
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('image', imageFile);

    // Hacer request con Content-Type multipart/form-data
    const response = await api.post('/recognition/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al reconocer fruta:', error);
    throw error;
  }
};

/**
 * Reconoce una fruta desde una URL de imagen
 * @param {string} imageUrl - URL de la imagen
 * @returns {Promise} - Promesa con los resultados del reconocimiento
 */
export const recognizeFruitFromUrl = async (imageUrl) => {
  try {
    const response = await api.post('/recognition/analyze-url', {
      imageUrl,
    });

    return response.data;
  } catch (error) {
    console.error('Error al reconocer fruta desde URL:', error);
    throw error;
  }
};

/**
 * Reconoce una fruta desde una imagen en base64
 * @param {string} base64Image - Imagen en formato base64
 * @returns {Promise} - Promesa con los resultados del reconocimiento
 */
export const recognizeFruitFromBase64 = async (base64Image) => {
  try {
    const response = await api.post('/recognition/analyze-base64', {
      image: base64Image,
    });

    return response.data;
  } catch (error) {
    console.error('Error al reconocer fruta desde base64:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de reconocimientos del usuario
 * @returns {Promise} - Promesa con el historial
 */
export const getRecognitionHistory = async () => {
  try {
    const response = await api.get('/recognition/history');
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial de reconocimiento:', error);
    throw error;
  }
};

/**
 * Guarda un resultado de reconocimiento
 * @param {Object} recognitionData - Datos del reconocimiento
 * @returns {Promise}
 */
export const saveRecognitionResult = async (recognitionData) => {
  try {
    const response = await api.post('/recognition/save', recognitionData);
    return response.data;
  } catch (error) {
    console.error('Error al guardar resultado de reconocimiento:', error);
    throw error;
  }
};

/**
 * Convierte un File a base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} - Promesa con la cadena base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Comprime una imagen antes de enviarla
 * @param {File} file - Archivo de imagen
 * @param {number} maxWidth - Ancho máximo
 * @param {number} maxHeight - Alto máximo
 * @param {number} quality - Calidad (0-1)
 * @returns {Promise<Blob>} - Promesa con el blob comprimido
 */
export const compressImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calcular nuevas dimensiones manteniendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
};

export default {
  recognizeFruit,
  recognizeFruitFromUrl,
  recognizeFruitFromBase64,
  getRecognitionHistory,
  saveRecognitionResult,
  fileToBase64,
  compressImage,
/**
 * Servicio para el reconocimiento de frutas con OpenAI Vision
 */

const API_URL = "http://localhost:4000/api/recognition";

/**
 * Reconocer fruta desde una imagen
 * @param {File} imageFile - Archivo de imagen
 * @returns {Promise<Object>} Resultado del reconocimiento
 */
export const recognizeFruit = async (imageFile) => {
  const formData = new FormData();
  formData.append("imagen", imageFile);

  const response = await fetch(`${API_URL}/fruit`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.mensaje || errorData.error || "Error al reconocer la fruta");
  }

  return response.json();
};

/**
 * Reconocer fruta con autenticación (requiere token)
 * @param {File} imageFile - Archivo de imagen
 * @param {string} token - Token JWT
 * @returns {Promise<Object>} Resultado del reconocimiento
 */
export const recognizeFruitAuth = async (imageFile, token) => {
  const formData = new FormData();
  formData.append("imagen", imageFile);

  const response = await fetch(`${API_URL}/fruit/auth`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.mensaje || errorData.error || "Error al reconocer la fruta");
  }

  return response.json();
};

/**
 * Obtener información nutricional de una fruta
 * @param {string} fruitName - Nombre de la fruta
 * @returns {Promise<Object>} Información nutricional
 */
export const getNutritionalInfo = async (fruitName) => {
  const response = await fetch(`${API_URL}/nutrition`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombreFruta: fruitName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.mensaje || errorData.error || "Error al obtener información nutricional");
  }

  return response.json();
};
