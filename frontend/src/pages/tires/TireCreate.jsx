import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tireSchema } from "../../validation/tire.schema";
import { tireService } from "../../services/tire.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  Circle,
  Save,
  X,
  Loader2,
  Calendar,
  Truck,
  MapPin,
  Hash,
  Gauge,
} from "lucide-react";

const TireCreate = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tireSchema),
    defaultValues: {
      associatedVehicleType: "Truck",
    },
  });

  const vehicleType = watch("associatedVehicleType");

  useEffect(() => {
    loadVehicles();
  }, [vehicleType]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      if (vehicleType === "Truck") {
        const trucksResponse = await truckService.getAll();
        // Extract array from response object
        const trucksData = Array.isArray(trucksResponse)
          ? trucksResponse
          : (trucksResponse?.trucks || []);
        setVehicles(trucksData.map(t => ({ id: t._id, label: t.matricule })));
      } else {
        const trailersResponse = await trailerService.getAll();
        // Extract array from response object
        const trailersData = Array.isArray(trailersResponse)
          ? trailersResponse
          : (trailersResponse?.trailers || []);
        setVehicles(trailersData.map(t => ({ id: t._id, label: t.matricule })));
      }
    } catch (error) {
      toast.error("Failed to load vehicles");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await tireService.create(data);
      toast.success("Tire record created successfully");
      navigate("/tires");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create tire");
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
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 dark:text-purple-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Circle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add Tire Record
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Record a new tire operation
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-colors"
            />
            {errors.installationDate && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.installationDate.message}
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-colors"
            >
              <option value="Truck">Truck</option>
              <option value="Trailer">Trailer</option>
            </select>
            {errors.associatedVehicleType && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.associatedVehicleType.message}
              </p>
            )}
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-colors"
            >
              <option value="">Select vehicle</option>
              {Array.isArray(vehicles) &&
                vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.label}
                  </option>
                ))}
            </select>
            {errors.associatedVehicleId && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.associatedVehicleId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="serialNumber"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Hash className="w-4 h-4" />
              Serial Number *
            </label>
            <input
              id="serialNumber"
              type="text"
              {...register("serialNumber")}
              placeholder="TIR-12345"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-colors"
            />
            {errors.serialNumber && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.serialNumber.message}
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-colors"
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
              htmlFor="brand"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Hash className="w-4 h-4" />
              Brand *
            </label>
            <input
              id="brand"
              type="text"
              {...register("brand")}
              placeholder="Michelin"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-colors"
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
              placeholder="315/80R22.5"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-colors"
            />
            {errors.size && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.size.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Tire Record
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/tires")}
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

export default TireCreate;
