import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckSchema } from "../../validation/truck.schema";
import { truckService } from "../../services/truck.service";
import { useApp } from "../../context/AppContext";
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
  Box,
  AlertCircle,
} from "lucide-react";

const TruckEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(true);
  const [truck, setTruck] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(truckSchema),
  });

  useEffect(() => {
    const fetchTruck = async () => {
      try {
        setLoading(true);
        const data = await truckService.getOne(id);
        
        const truckData = data.data || data;
        setTruck(truckData);
        
        reset({
          matricule: truckData.matricule,
          brand: truckData.brand,
          model: truckData.model,
          yearOfManufacture: truckData.yearOfManufacture,
          status: truckData.status,
          currentMileage: truckData.currentMileage,
          fuelType: truckData.fuelType,
        });
      } catch (error) {
        showError(error.response?.data?.message || "Failed to load truck");
        navigate("/trucks");
      } finally {
        setLoading(false);
      }
    };

    fetchTruck();
  }, [id, navigate, reset, showError]);

  const onSubmit = async (data) => {
    try {
      data.yearOfManufacture = parseInt(data.yearOfManufacture);
      data.currentMileage = parseInt(data.currentMileage);

      await truckService.update(id, data);
      showSuccess("Truck updated successfully");
      navigate("/trucks");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update truck");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!truck) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200">Truck not found</p>
          </div>
        </div>
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
            Update the truck details below
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="matricule"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Hash className="w-4 h-4" />
              Matricule *
            </label>
            <input
              id="matricule"
              type="text"
              {...register("matricule")}
              placeholder="TRK-001"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.matricule && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.matricule.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Uppercase alphanumeric with hyphens only
            </p>
          </div>

          <div>
            <label
              htmlFor="brand"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Tag className="w-4 h-4" />
              Brand *
            </label>
            <input
              id="brand"
              type="text"
              {...register("brand")}
              placeholder="Volvo"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.brand && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.brand.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="model"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Box className="w-4 h-4" />
              Model *
            </label>
            <input
              id="model"
              type="text"
              {...register("model")}
              placeholder="FH16"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.model && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.model.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="yearOfManufacture"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Calendar className="w-4 h-4" />
              Year of Manufacture *
            </label>
            <input
              id="yearOfManufacture"
              type="number"
              {...register("yearOfManufacture", { valueAsNumber: true })}
              placeholder="2023"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.yearOfManufacture && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.yearOfManufacture.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="fuelType"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Fuel className="w-4 h-4" />
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

          <div>
            <label
              htmlFor="status"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Activity className="w-4 h-4" />
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

          <div>
            <label
              htmlFor="currentMileage"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Gauge className="w-4 h-4" />
              Current Mileage (km)
            </label>
            <input
              id="currentMileage"
              type="number"
              {...register("currentMileage", { valueAsNumber: true })}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.currentMileage && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.currentMileage.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 dark:hover:from-blue-600 dark:hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Truck
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/trucks")}
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors inline-flex items-center gap-2"
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
