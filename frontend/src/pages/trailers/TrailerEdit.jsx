import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trailerSchema } from "../../validation/trailer.schema";
import { trailerService } from "../../services/trailer.service";
import { useApp } from "../../context/AppContext";
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
  AlertCircle,
} from "lucide-react";

const TrailerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(trailerSchema),
  });

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        setLoading(true);
        const data = await trailerService.getOne(id);
        const trailerData = data.data || data;
        setTrailer(trailerData);
        reset({
          matricule: trailerData.matricule,
          type: trailerData.type,
          maximumLoad: trailerData.maximumLoad,
          status: trailerData.status,
          currentMileage: trailerData.currentMileage,
        });
      } catch (error) {
        showError(error.response?.data?.message || "Failed to load trailer");
        navigate("/trailers");
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [id, navigate, showError, reset]);

  const onSubmit = async (data) => {
    try {
      data.maximumLoad = parseFloat(data.maximumLoad);
      data.currentMileage = parseFloat(data.currentMileage);
      await trailerService.update(id, data);
      showSuccess("Trailer updated successfully");
      navigate("/trailers");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update trailer");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  if (!trailer) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200">Trailer not found</p>
          </div>
        </div>
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
            Update the trailer details below
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Hash className="w-4 h-4" />
              Matricule *
            </label>
            <input
              type="text"
              {...register("matricule")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-colors"
              placeholder="ABC-123"
            />
            {errors.matricule && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.matricule.message}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Package className="w-4 h-4" />
              Type *
            </label>
            <select
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

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Weight className="w-4 h-4" />
              Maximum Load (kg) *
            </label>
            <input
              type="number"
              {...register("maximumLoad", { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-colors"
              placeholder="25000"
            />
            {errors.maximumLoad && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.maximumLoad.message}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Activity className="w-4 h-4" />
              Status *
            </label>
            <select
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

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Gauge className="w-4 h-4" />
              Current Mileage (km)
            </label>
            <input
              type="number"
              {...register("currentMileage", { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-colors"
              placeholder="0"
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
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Trailer
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/trailers")}
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

export default TrailerEdit;
