import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckSchema } from "../../validation/truck.schema";
import { truckService } from "../../services/truck.service";
import { useApp } from "../../context/AppContext";
import { toast } from "react-toastify";

const TruckEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(truckSchema),
  });

  useEffect(() => {
    const loadTruck = async () => {
      try {
        const data = await truckService.getOne(id);
        setValue("matricule", data.matricule);
        setValue("brand", data.brand);
        setValue("model", data.model);
        setValue("yearOfManufacture", data.yearOfManufacture);
        setValue("fuelType", data.fuelType);
        setValue("status", data.status);
        setValue("currentMileage", data.currentMileage);
      } catch (e) {
        toast.error("Failed to load truck data");
        navigate("/trucks");
      } finally {
        setLoading(false);
      }
    };
    loadTruck();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      data.yearOfManufacture = parseInt(data.yearOfManufacture);
      data.currentMileage = parseInt(data.currentMileage);
      await truckService.update(id, data);
      showSuccess("Truck updated successfully");
      navigate(`/trucks/${id}`);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update truck");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading truck data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Truck</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Matricule *</label>
          <input type="text" {...register("matricule")} className="w-full px-3 py-2 border rounded" />
          {errors.matricule && <p className="text-red-600 text-sm">{errors.matricule.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <input type="text" {...register("brand")} className="w-full px-3 py-2 border rounded" />
          {errors.brand && <p className="text-red-600 text-sm">{errors.brand.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
          <input type="text" {...register("model")} className="w-full px-3 py-2 border rounded" />
          {errors.model && <p className="text-red-600 text-sm">{errors.model.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year of Manufacture *</label>
          <input type="number" {...register("yearOfManufacture", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded" />
          {errors.yearOfManufacture && <p className="text-red-600 text-sm">{errors.yearOfManufacture.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
          <select {...register("fuelType")} className="w-full px-3 py-2 border rounded">
            <option value="">Select fuel type</option>
            <option value="Diesel">Diesel</option>
            <option value="Essence">Essence</option>
            <option value="Électrique">Électrique</option>
            <option value="Hybride">Hybride</option>
          </select>
          {errors.fuelType && <p className="text-red-600 text-sm">{errors.fuelType.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select {...register("status")} className="w-full px-3 py-2 border rounded">
            <option value="Disponible">Disponible</option>
            <option value="En Mission">En Mission</option>
            <option value="En Maintenance">En Maintenance</option>
          </select>
          {errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Mileage (km) *</label>
          <input type="number" {...register("currentMileage", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded" />
          {errors.currentMileage && <p className="text-red-600 text-sm">{errors.currentMileage.message}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? "Updating..." : "Update Truck"}
          </button>
          <button type="button" onClick={() => navigate(`/trucks/${id}`)} className="px-4 py-2 border rounded hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TruckEdit;
