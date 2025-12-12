import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trailerSchema } from "../../validation/trailer.schema";
import { trailerService } from "../../services/trailer.service";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";

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
    fetchTrailer();
  }, [id]);

  const fetchTrailer = async () => {
    try {
      const trailer = await trailerService.getOne(id);
      Object.keys(trailer).forEach((key) => setValue(key, trailer[key]));
    } catch (error) {
      showError("Failed to fetch trailer details");
      navigate("/trailers");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Trailer</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matricule *
            </label>
            <input
              type="text"
              {...register("matricule")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.matricule && (
              <p className="mt-1 text-sm text-red-600">
                {errors.matricule.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              {...register("type")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Frigo">Frigo</option>
              <option value="Plateau">Plateau</option>
              <option value="Fourgon">Fourgon</option>
              <option value="Citerne">Citerne</option>
              <option value="Benne">Benne</option>
              <option value="Porte-conteneur">Porte-conteneur</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Load (kg) *
            </label>
            <input
              type="number"
              {...register("maximumLoad", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.maximumLoad && (
              <p className="mt-1 text-sm text-red-600">
                {errors.maximumLoad.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Disponible">Disponible</option>
              <option value="En Mission">En Mission</option>
              <option value="En Maintenance">En Maintenance</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Mileage (km)
            </label>
            <input
              type="number"
              {...register("currentMileage", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.currentMileage && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentMileage.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/trailers")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Trailer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrailerEdit;
