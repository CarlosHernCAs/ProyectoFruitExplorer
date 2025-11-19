import { apiFetch } from "./apiFetch";

// Obtener todas las frutas (lista)
export const getFruits = () => apiFetch("/fruits");

// Obtener una fruta por ID
export const getFruitById = (id) => apiFetch(`/fruits/${id}`);

// Obtener una fruta por slug
export const getFruitBySlug = (slug) => apiFetch(`/fruits/slug/${slug}`);

// Obtener recetas de una fruta
export const getFruitRecipes = (fruitId) => apiFetch(`/fruits/${fruitId}/recipes`);

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

// Eliminar fruta
export const deleteFruit = (id) =>
  apiFetch(`/fruits/${id}`, {
    method: "DELETE",
  });

// Marcar fruta como sincronizada
export const syncFruit = (id) =>
  apiFetch(`/fruits/${id}/sync`, {
    method: "POST",
  });
