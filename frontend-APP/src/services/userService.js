import { apiFetch } from "./api";

export const getAllUsers = () => {
  return apiFetch("/user");
};

export const registerUser = (data) => {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  });
};
