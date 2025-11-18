import { apiFetch } from "./api";

// Obtener todas las frutas (lista)
export const getFruits = () => apiFetch("/fruits");

// Obtener una fruta por ID
export const getFruitById = (id) => apiFetch(`/fruits/${id}`);

// Crear fruta
export const createFruit = (body) =>
  apiFetch("/fruits", {
    method: "POST",
    body: JSON.stringify(body),
  });

// Actualizar fruta
export const updateFruit = (id, body) =>
  apiFetch(`/fruits/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

// Eliminar fruta (si deseas agregarlo después)
export const deleteFruit = (id) =>
  apiFetch(`/fruits/${id}`, {
    method: "DELETE",
  });
