import api from "./axios";

export const getOrders = () => {
  return api.get("/orders/admin/dashboard");
};

export const getCarts = () => {
  return api.get("/orders/admin/carts");
};

export const getOrdersAdmin = () => {
  return api.get("/orders/admin");
};

export const getOrder = (id) => {
  return api.get(`/orders/admin/${id}`);
};

export const orderStatus = (id, status) => {
  return api.patch(`/orders/admin/${id}/status`, {
    status,
  });
};