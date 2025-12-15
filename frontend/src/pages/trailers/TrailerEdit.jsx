import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trailerSchema } from "../../validation/trailer.schema";
import { trailerService } from "../../services/trailer.service";
import { useApp } from "../../context/AppContext";
import { toast } from "react-toastify";

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
        const data = await trailerService.getOne(id);
        setValue("matricule", data.matricule);
        setValue("type", data.type);
        setValue("maximumLoad", data.maximumLoad);
        setValue("status", data.status);
        setValue("currentMileage", data.currentMileage);
      } catch (e) {
        toast.error("Failed to load trailer data");
        navigate("/trailers");
      } finally {
        setLoading(false);
      }
    };
    loadTrailer();
  }, [id]);

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
        <p className="text-gray-500">Loading trailer data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Trailer</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Matricule *</label>
          <input type="text" {...register("matricule")} className="w-full px-3 py-2 border rounded" />
          {errors.matricule && <p className="text-red-600 text-sm">{errors.matricule.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select {...register("type")} className="w-full px-3 py-2 border rounded">
            <option value="">Select type</option>
            <option value="Frigo">Frigo</option>
            <option value="Plateau">Plateau</option>
            <option value="Fourgon">Fourgon</option>
            <option value="Citerne">Citerne</option>
            <option value="Benne">Benne</option>
            <option value="Porte-conteneur">Porte-conteneur</option>
          </select>
          {errors.type && <p className="text-red-600 text-sm">{errors.type.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Load (kg) *</label>
          <input type="number" {...register("maximumLoad", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded" />
          {errors.maximumLoad && <p className="text-red-600 text-sm">{errors.maximumLoad.message}</p>}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Mileage (km)</label>
          <input type="number" {...register("currentMileage", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded" />
          {errors.currentMileage && <p className="text-red-600 text-sm">{errors.currentMileage.message}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? "Updating..." : "Update Trailer"}
          </button>
          <button type="button" onClick={() => navigate(`/trailers/${id}`)} className="px-4 py-2 border rounded hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrailerEdit;
