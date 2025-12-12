import axiosInstance from "../api/axiosInstance";

export const maintenanceService = {
  getAll: async () => {
    const response = await axiosInstance.get("/maintenances");
    return response.data;
  },

  getOne: async (id) => {
    const response = await axiosInstance.get(`/maintenances/${id}`);
    return response.data;
  },

  create: async (maintenanceData) => {
    const response = await axiosInstance.post("/maintenances", maintenanceData);
    return response.data;
  },

  update: async (id, maintenanceData) => {
    const response = await axiosInstance.put(
      `/maintenances/${id}`,
      maintenanceData
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/maintenances/${id}`);
    return response.data;
  },
};
