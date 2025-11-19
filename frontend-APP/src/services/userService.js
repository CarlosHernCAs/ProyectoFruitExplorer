import { apiFetch } from "./apiFetch";

export const getAllUsers = () => {
  return apiFetch("/users");
};

export const getUserById = (id) => {
  return apiFetch(`/users/${id}`);
};

export const registerUser = (data) => {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateProfile = (data) => {
  return apiFetch("/users/update", {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const deleteUser = (id) => {
  return apiFetch(`/users/${id}`, {
    method: "DELETE"
  });
};

export const assignRole = (userId, roleId) => {
  return apiFetch("/users/assign-role", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, role_id: roleId })
  });
};

export const removeRole = (userId, roleId) => {
  return apiFetch("/users/remove-role", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, role_id: roleId })
  });
};
