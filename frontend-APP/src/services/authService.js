import { apiFetch } from "./api";

export const login = async (email, password) => {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // 👉 Guardamos token + usuario correctamente
  localStorage.setItem("token", data.token);
  localStorage.setItem("usuario", JSON.stringify(data.user));

  return data; // devuelve { token, user }
};

export const register = async (email, password, display_name) => {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, display_name }),
  });

  // 👉 El register no devuelve token ni user (según tu backend)
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};
