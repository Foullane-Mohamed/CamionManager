import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tireSchema } from "../../validation/tire.schema";
import { tireService } from "../../services/tire.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { toast } from "react-toastify";
import {
  CircleDot,
  Save,
  X,
  Loader2,
  Calendar,
  Truck,
  Tag,
  Gauge,
  MapPin,
} from "lucide-react";

const TireEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tireSchema),
  });

  const vehicleType = watch("associatedVehicleType");

  useEffect(() => {
    loadVehicles();
  }, [vehicleType]);

  useEffect(() => {
    loadData();
  }, [id]);

  // Helper function to safely extract arrays from API responses
  const extractArray = (response, keys = []) => {
    if (Array.isArray(response)) return response;
    for (const key of keys) {
      if (response && Array.isArray(response[key])) return response[key];
    }
    return [];
  };

  const loadData = async () => {
    try {
      const response = await tireService.getOne(id);

      const data = response?.tire || response?.data || response;

      setValue("serialNumber", data.serialNumber);
      setValue("brand", data.brand);
      setValue("size", data.size);
      setValue("status", data.status);
      setValue(
        "installationDate",
        new Date(data.installationDate).toISOString().slice(0, 10)
      );
      setValue("vehiclePosition", data.vehiclePosition);
      setValue("associatedVehicleType", data.associatedVehicleType);
      setValue(
        "associatedVehicleId",
        data.associatedVehicleId?._id || data.associatedVehicleId
      );
    } catch (error) {
      console.error("Error loading tire data:", error);
      toast.error(error.response?.data?.message || "Failed to load tire data");
      navigate("/tires");
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      if (vehicleType === "Truck") {
        const trucksResponse = await truckService.getAll();
        const trucksData = extractArray(trucksResponse, ["trucks", "data"]);
        setVehicles(trucksData.map((t) => ({ id: t._id, label: t.matricule })));
      } else if (vehicleType === "Trailer") {
        const trailersResponse = await trailerService.getAll();
        const trailersData = extractArray(trailersResponse, [
          "trailers",
          "data",
        ]);
        setVehicles(
          trailersData.map((t) => ({ id: t._id, label: t.matricule }))
        );
      }
    } catch (error) {
      toast.error("Failed to load vehicles");
    }
  };

  const onSubmit = async (data) => {
    try {
      await tireService.update(id, data);
      toast.success("Tire updated successfully");
      navigate(`/tires/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update tire");
    }
  };

  const positions = [
    "Front Left",
    "Front Right",
    "Rear Left",
    "Rear Right",
    "Spare",
    "Trailer Front Left",
    "Trailer Front Right",
    "Trailer Rear Left",
    "Trailer Rear Right",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600 dark:text-orange-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 dark:from-orange-500 dark:to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
          <CircleDot className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Tire
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update tire information
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="serialNumber"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              Serial Number *
            </label>
            <input
              id="serialNumber"
              type="text"
              {...register("serialNumber")}
              placeholder="e.g., TIRE-2024-001"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            />
            {errors.serialNumber && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.serialNumber.message}
              </p>
            )}
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
              placeholder="e.g., Michelin"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            />
            {errors.brand && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.brand.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="size"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Gauge className="w-4 h-4" />
              Size *
            </label>
            <input
              id="size"
              type="text"
              {...register("size")}
              placeholder="e.g., 295/80R22.5"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            />
            {errors.size && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.size.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="status"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <CircleDot className="w-4 h-4" />
              Status *
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            >
              <option value="Bon">Bon</option>
              <option value="Usé">Usé</option>
              <option value="À remplacer">À remplacer</option>
            </select>
            {errors.status && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="installationDate"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Calendar className="w-4 h-4" />
              Installation Date *
            </label>
            <input
              id="installationDate"
              type="date"
              {...register("installationDate")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            />
            {errors.installationDate && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.installationDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="vehiclePosition"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <MapPin className="w-4 h-4" />
              Position *
            </label>
            <select
              id="vehiclePosition"
              {...register("vehiclePosition")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            >
              <option value="">Select position</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
            {errors.vehiclePosition && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.vehiclePosition.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="associatedVehicleType"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Truck className="w-4 h-4" />
              Vehicle Type *
            </label>
            <select
              id="associatedVehicleType"
              {...register("associatedVehicleType")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            >
              <option value="Truck">Truck</option>
              <option value="Trailer">Trailer</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="associatedVehicleId"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Truck className="w-4 h-4" />
              Vehicle *
            </label>
            <select
              id="associatedVehicleId"
              {...register("associatedVehicleId")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            >
              <option value="">Select vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
            {errors.associatedVehicleId && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.associatedVehicleId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-500 dark:to-red-500 text-white rounded-lg hover:from-orange-700 hover:to-red-700 dark:hover:from-orange-600 dark:hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Tire
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/tires/${id}`)}
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

export default TireEdit;
