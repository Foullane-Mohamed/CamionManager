import axiosInstance from "../api/axiosInstance";

export const truckService = {
  getAll: async () => {
    const response = await axiosInstance.get("/trucks");
    return response.data;
  },

  getAvailable: async () => {
    const response = await axiosInstance.get("/trucks/available");
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get("/trucks/stats");
    return response.data;
  },

  getOne: async (id) => {
    const response = await axiosInstance.get(`/trucks/${id}`);
    return response.data;
  },

  create: async (truckData) => {
    const response = await axiosInstance.post("/trucks", truckData);
    return response.data;
  },

  update: async (id, truckData) => {
    const response = await axiosInstance.put(`/trucks/${id}`, truckData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/trucks/${id}/status`, {
      status,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/trucks/${id}`);
    return response.data;
  },
};
