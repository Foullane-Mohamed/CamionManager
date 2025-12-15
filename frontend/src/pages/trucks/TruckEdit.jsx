import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckSchema } from "../../validation/truck.schema";
import { truckService } from "../../services/truck.service";
import { useApp } from "../../context/AppContext";
import { toast } from "react-toastify";
import {
  Truck,
  Save,
  X,
  Loader2,
  Hash,
  Tag,
  Calendar,
  Gauge,
  Activity,
  Fuel,
} from "lucide-react";

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
        const response = await truckService.getOne(id);

        // Handle wrapped response formats
        const data = response?.truck || response?.data || response;

        if (!data) {
          throw new Error("No truck data received");
        }

        setValue("matricule", data.matricule || "");
        setValue("brand", data.brand || "");
        setValue("model", data.model || "");
        setValue("yearOfManufacture", data.yearOfManufacture || "");
        setValue("fuelType", data.fuelType || "");
        setValue("status", data.status || "Disponible");
        setValue("currentMileage", data.currentMileage || 0);

        console.log("Loaded truck data:", data);
      } catch (error) {
        console.error("Error loading truck:", error);
        toast.error(
          error.response?.data?.message || "Failed to load truck data"
        );
        navigate("/trucks");
      } finally {
        setLoading(false);
      }
    };
    loadTruck();
  }, [id, navigate, setValue]);

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
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Truck className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Truck
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update truck information
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matricule */}
          <div>
            <label
              htmlFor="matricule"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Matricule *
            </label>
            <input
              id="matricule"
              type="text"
              {...register("matricule")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              placeholder="e.g., ABC-123-XYZ"
            />
            {errors.matricule && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.matricule.message}
              </p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label
              htmlFor="brand"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Brand *
            </label>
            <input
              id="brand"
              type="text"
              {...register("brand")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              placeholder="e.g., Mercedes-Benz"
            />
            {errors.brand && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.brand.message}
              </p>
            )}
          </div>

          {/* Model */}
          <div>
            <label
              htmlFor="model"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Model *
            </label>
            <input
              id="model"
              type="text"
              {...register("model")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              placeholder="e.g., Actros 1848"
            />
            {errors.model && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.model.message}
              </p>
            )}
          </div>

          {/* Year of Manufacture */}
          <div>
            <label
              htmlFor="yearOfManufacture"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Year of Manufacture *
            </label>
            <input
              id="yearOfManufacture"
              type="number"
              {...register("yearOfManufacture", { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              placeholder="e.g., 2020"
            />
            {errors.yearOfManufacture && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.yearOfManufacture.message}
              </p>
            )}
          </div>

          {/* Fuel Type */}
          <div>
            <label
              htmlFor="fuelType"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Fuel className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Fuel Type *
            </label>
            <select
              id="fuelType"
              {...register("fuelType")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            >
              <option value="">Select fuel type</option>
              <option value="Diesel">Diesel</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Other">Other</option>
            </select>
            {errors.fuelType && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.fuelType.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Status *
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            >
              <option value="Disponible">Disponible</option>
              <option value="En Mission">En Mission</option>
              <option value="En Maintenance">En Maintenance</option>
            </select>
            {errors.status && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Current Mileage */}
          <div className="md:col-span-2">
            <label
              htmlFor="currentMileage"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Gauge className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Current Mileage (km) *
            </label>
            <input
              id="currentMileage"
              type="number"
              {...register("currentMileage", { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              placeholder="e.g., 125000"
            />
            {errors.currentMileage && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.currentMileage.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 dark:hover:from-blue-600 dark:hover:to-cyan-600 transition-all duration-200 font-medium inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/trucks/${id}`)}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium inline-flex items-center gap-2 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TruckEdit;
