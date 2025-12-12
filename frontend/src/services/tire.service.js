import axiosInstance from "../api/axiosInstance";

export const tireService = {
  getAll: async () => {
    const response = await axiosInstance.get("/tires");
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get("/tires/stats");
    return response.data;
  },

  getOne: async (id) => {
    const response = await axiosInstance.get(`/tires/${id}`);
    return response.data;
  },

  create: async (tireData) => {
    const response = await axiosInstance.post("/tires", tireData);
    return response.data;
  },

  update: async (id, tireData) => {
    const response = await axiosInstance.put(`/tires/${id}`, tireData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/tires/${id}/status`, {
      status,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/tires/${id}`);
    return response.data;
  },
};
