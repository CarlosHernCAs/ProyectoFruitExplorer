import { apiFetch } from "./apiFetch";

// Obtener todas las regiones
export const getRegions = () => apiFetch("/regions");

// Obtener una región por ID
export const getRegionById = (id) => apiFetch(`/regions/${id}`);

// Obtener frutas de una región
export const getRegionFruits = (regionId) => apiFetch(`/regions/${regionId}/fruits`);

// Crear región
export const createRegion = (data) =>
  apiFetch("/regions", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Actualizar región
export const updateRegion = (id, data) =>
  apiFetch(`/regions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// Eliminar región
export const deleteRegion = (id) =>
  apiFetch(`/regions/${id}`, {
    method: "DELETE",
  });
