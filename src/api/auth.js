import api from "./axios";

export const login = (data) => {
  return api.post("/auth/login", data);
};

export const logout = () => {
  return api.post("/auth/logout");
};

export const getMe = () => {
  return api.get("/auth/me");
};