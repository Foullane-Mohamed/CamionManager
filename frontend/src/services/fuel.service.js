import axiosInstance from "../api/axiosInstance";

export const fuelService = {
  getAll: async () => {
    const response = await axiosInstance.get("/fuels");
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get("/fuels/stats");
    return response.data;
  },

  getOne: async (id) => {
    const response = await axiosInstance.get(`/fuels/${id}`);
    return response.data;
  },

  create: async (fuelData) => {
    const response = await axiosInstance.post("/fuels", fuelData);
    return response.data;
  },

  update: async (id, fuelData) => {
    const response = await axiosInstance.put(`/fuels/${id}`, fuelData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/fuels/${id}`);
    return response.data;
  },
};
