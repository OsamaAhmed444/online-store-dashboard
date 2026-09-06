import api from "./axios";

export const getProducts = (filters = {}) => {
  return api.get("/products", {
    params: filters,
  });
};

export const addProduct = (data) => {
  return api.post("/products", data);
};

export const searchProducts = (query) => {
  return api.get("/products/search", {
    params: query,
  });
};

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const updateProduct = (id, data) => {
  return api.patch(`/products/update/${id}`, data);
};

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};