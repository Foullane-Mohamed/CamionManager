import axiosInstance from "../api/axiosInstance";

export const authService = {
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },
  login: async (email, password) => {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get("/auth/profile");
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },
};
