import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trailerSchema } from "../../validation/trailer.schema";
import { trailerService } from "../../services/trailer.service";
import { useApp } from "../../context/AppContext";
import { toast } from "react-toastify";
import {
  Container,
  Save,
  X,
  Loader2,
  Hash,
  Package,
  Weight,
  Activity,
  Gauge,
} from "lucide-react";

const TrailerEdit = () => {
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
    resolver: zodResolver(trailerSchema),
  });

  useEffect(() => {
    const loadTrailer = async () => {
      try {
        const response = await trailerService.getOne(id);

        // Handle wrapped response formats
        const data = response?.trailer || response?.data || response;

        if (!data) {
          throw new Error("No trailer data received");
        }

        setValue("matricule", data.matricule || "");
        setValue("type", data.type || "");
        setValue("maximumLoad", data.maximumLoad || 0);
        setValue("status", data.status || "Disponible");
        setValue("currentMileage", data.currentMileage || 0);

        console.log("Loaded trailer data:", data);
      } catch (error) {
        console.error("Error loading trailer:", error);
        toast.error(
          error.response?.data?.message || "Failed to load trailer data"
        );
        navigate("/trailers");
      } finally {
        setLoading(false);
      }
    };
    loadTrailer();
  }, [id, navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      data.maximumLoad = parseFloat(data.maximumLoad);
      data.currentMileage = parseFloat(data.currentMileage);
      await trailerService.update(id, data);
      showSuccess("Trailer updated successfully");
      navigate(`/trailers/${id}`);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update trailer");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Container className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Trailer
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update trailer information
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
              <Hash className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Matricule *
            </label>
            <input
              id="matricule"
              type="text"
              {...register("matricule")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-colors"
              placeholder="e.g., TRL-456-ABC"
            />
            {errors.matricule && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.matricule.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Type *
            </label>
            <select
              id="type"
              {...register("type")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-colors"
            >
              <option value="">Select type</option>
              <option value="Frigo">Frigo</option>
              <option value="Plateau">Plateau</option>
              <option value="Fourgon">Fourgon</option>
              <option value="Citerne">Citerne</option>
              <option value="Benne">Benne</option>
              <option value="Porte-conteneur">Porte-conteneur</option>
            </select>
            {errors.type && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Maximum Load */}
          <div>
            <label
              htmlFor="maximumLoad"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Weight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Maximum Load (kg) *
            </label>
            <input
              id="maximumLoad"
              type="number"
              {...register("maximumLoad", { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-colors"
              placeholder="e.g., 25000"
            />
            {errors.maximumLoad && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.maximumLoad.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Status *
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-colors"
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
              <Gauge className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Current Mileage (km)
            </label>
            <input
              id="currentMileage"
              type="number"
              {...register("currentMileage", { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-colors"
              placeholder="e.g., 85000"
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
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 transition-all duration-200 font-medium inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
            onClick={() => navigate(`/trailers/${id}`)}
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

export default TrailerEdit;
