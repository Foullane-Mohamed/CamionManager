import axiosInstance from "../api/axiosInstance";

export const trailerService = {
  getAll: async () => {
    const response = await axiosInstance.get("/trailers");
    return response.data;
  },

  getAvailable: async () => {
    const response = await axiosInstance.get("/trailers/available");
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get("/trailers/stats");
    return response.data;
  },

  getOne: async (id) => {
    const response = await axiosInstance.get(`/trailers/${id}`);
    return response.data;
  },

  create: async (trailerData) => {
    const response = await axiosInstance.post("/trailers", trailerData);
    return response.data;
  },

  update: async (id, trailerData) => {
    const response = await axiosInstance.put(`/trailers/${id}`, trailerData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/trailers/${id}/status`, {
      status,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/trailers/${id}`);
    return response.data;
  },
};
