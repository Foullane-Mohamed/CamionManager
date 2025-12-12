import axiosInstance from "../api/axiosInstance";

export const userService = {
  getAll: async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
  },

  getPending: async () => {
    const response = await axiosInstance.get("/users/pending");
    return response.data;
  },

  getOne: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  createAdmin: async (userData) => {
    const response = await axiosInstance.post("/users/admin", userData);
    return response.data;
  },

  approve: async (id, accountStatus) => {
    const response = await axiosInstance.put(`/users/${id}/approve`, {
      accountStatus,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};
