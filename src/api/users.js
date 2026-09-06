import api from "./axios";

export const getUsers = () => {
  return api.get("/users/all");
};

export const addUser = (data) => {
  return api.post("/users/add", data);
};

export const createUser = addUser;

export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

export const updateUser = (id, data) => {
  return api.patch(`/users/${id}`, data);
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};