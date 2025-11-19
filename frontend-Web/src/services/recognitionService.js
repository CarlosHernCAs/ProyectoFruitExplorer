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
