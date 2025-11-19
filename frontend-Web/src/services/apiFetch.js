const API_URL = "http://localhost:4000/api";

export async function apiFetch(endpoint, options = {}) {
  const API_URL = "http://localhost:4000/api";

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  };

  const res = await fetch(API_URL + endpoint, config);

  if (!res.ok) {
    let msg = "Error desconocido";
    try {
      const data = await res.json();
      msg = data.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  return res.json();
}
