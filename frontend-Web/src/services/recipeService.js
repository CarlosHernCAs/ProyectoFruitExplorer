import { apiFetch } from "./apiFetch";

// Obtener todas las recetas
export const getRecipes = () => apiFetch("/recipes");

// Obtener una receta por ID
export const getRecipeById = (id) => apiFetch(`/recipes/${id}`);

// Crear receta
export const createRecipe = (data) =>
  apiFetch("/recipes", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Actualizar receta
export const updateRecipe = (id, data) =>
  apiFetch(`/recipes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// Eliminar receta
export const deleteRecipe = (id) =>
  apiFetch(`/recipes/${id}`, {
    method: "DELETE",
  });
