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

export const sendPasswordResetOtp = (email) => {
  return api.post("/auth/forgot-password/send-otp", { email });
};

export const resetPasswordWithOtp = (data) => {
  return api.post("/auth/forgot-password/verify-otp", data);
};

export const changeRole = (userId, role) => {
  return api.patch("/auth/change-role", { userId, role });
};