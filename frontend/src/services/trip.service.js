import axiosInstance from "../api/axiosInstance";

export const tripService = {
  getAll: async () => {
    const response = await axiosInstance.get("/trips");
    return response.data;
  },

  getOne: async (id) => {
    const response = await axiosInstance.get(`/trips/${id}`);
    return response.data;
  },

  create: async (tripData) => {
    const response = await axiosInstance.post("/trips", tripData);
    return response.data;
  },

  update: async (id, tripData) => {
    const response = await axiosInstance.put(`/trips/${id}`, tripData);
    return response.data;
  },

  updateStatus: async (id, statusData) => {
    const response = await axiosInstance.patch(
      `/trips/${id}/status`,
      statusData
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/trips/${id}`);
    return response.data;
  },

  generatePDF: async (id) => {
    const response = await axiosInstance.get(`/trips/${id}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
};
