import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maintenanceSchema } from "../../validation/maintenance.schema";
import { maintenanceService } from "../../services/maintenance.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  Wrench,
  Save,
  X,
  Loader2,
  Calendar,
  Truck,
  DollarSign,
  FileText,
  Settings,
  AlertCircle,
  Gauge,
} from "lucide-react";

const MaintenanceCreate = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      maintenanceType: "Oil Change",
      status: "Completed",
      vehicleMileageAtMaintenance: 0,
      cost: 0,
    },
  });
  const selectedVehicleId = watch("linkedVehicle");

  useEffect(() => {
    if (selectedVehicleId && vehicles.length > 0) {
      const selectedVehicle = vehicles.find(v => v._id === selectedVehicleId);
      if (selectedVehicle && selectedVehicle.currentMileage) {
        setValue("vehicleMileageAtMaintenance", selectedVehicle.currentMileage);
      }
    }
  }, [selectedVehicleId, vehicles, setValue]);
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const [trucksResponse, trailersResponse] = await Promise.all([
          truckService.getAll(),          trailerService.getAll(),
        ]);

        let trucks = [];
        let trailers = [];

        if (Array.isArray(trucksResponse)) {
          trucks = trucksResponse;
        } else if (trucksResponse && Array.isArray(trucksResponse.trucks)) {
          trucks = trucksResponse.trucks;
        } else if (trucksResponse && Array.isArray(trucksResponse.data)) {
          trucks = trucksResponse.data;
        }

        if (Array.isArray(trailersResponse)) {
          trailers = trailersResponse;
        } else if (
          trailersResponse &&
          Array.isArray(trailersResponse.trailers)
        ) {
          trailers = trailersResponse.trailers;
        } else if (trailersResponse && Array.isArray(trailersResponse.data)) {
          trailers = trailersResponse.data;
        }

        const allVehicles = [
          ...trucks.map((t) => ({
            ...t,
            type: "Truck",
            label: `${t.matricule} (Truck)`,
          })),
          ...trailers.map((t) => ({
            ...t,
            type: "Trailer",
            label: `${t.matricule} (Trailer)`,
          })),        ];        setVehicles(allVehicles);
      } catch {
        toast.error("Failed to load vehicles");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, []);
  const onSubmit = async (data) => {
    try {
      await maintenanceService.create(data);
      toast.success("Maintenance record created successfully");
      navigate("/maintenances");
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to create maintenance record"
      );
    }
  };

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
        <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 dark:from-orange-500 dark:to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Wrench className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add Maintenance Record
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Record a new maintenance operation
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
              htmlFor="maintenanceDate"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Calendar className="w-4 h-4" />
              Maintenance Date *
            </label>
            <input
              id="maintenanceDate"
              type="date"
              {...register("maintenanceDate")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            />
            {errors.maintenanceDate && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.maintenanceDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="linkedVehicle"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Truck className="w-4 h-4" />
              Vehicle *
            </label>{" "}
            <select
              id="linkedVehicle"
              {...register("linkedVehicle")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            >
              <option value="">Select vehicle</option>
              {Array.isArray(vehicles) &&
                vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.label}
                  </option>
                ))}
            </select>
            {errors.linkedVehicle && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.linkedVehicle.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="maintenanceType"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Settings className="w-4 h-4" />
              Maintenance Type *
            </label>
            <select
              id="maintenanceType"
              {...register("maintenanceType")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            >
              <option value="Oil Change">Oil Change</option>
              <option value="Tire Replacement">Tire Replacement</option>
              <option value="Vehicle Revision">Vehicle Revision</option>
              <option value="Other">Other</option>
            </select>
            {errors.maintenanceType && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.maintenanceType.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="vehicleMileageAtMaintenance"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Gauge className="w-4 h-4" />
              Vehicle Mileage *
            </label>
            <input
              id="vehicleMileageAtMaintenance"
              type="number"
              {...register("vehicleMileageAtMaintenance", { valueAsNumber: true })}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            />
            {errors.vehicleMileageAtMaintenance && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.vehicleMileageAtMaintenance.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="serviceProvider"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <FileText className="w-4 h-4" />
              Service Provider *
            </label>
            <input
              id="serviceProvider"
              type="text"
              {...register("serviceProvider")}
              placeholder="Enter service provider name"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            />
            {errors.serviceProvider && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.serviceProvider.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="cost"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <DollarSign className="w-4 h-4" />
              Cost *
            </label>
            <input
              id="cost"
              type="number"
              step="0.01"
              {...register("cost", { valueAsNumber: true })}
              placeholder="0.00"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            />
            {errors.cost && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.cost.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="status"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <AlertCircle className="w-4 h-4" />
              Status *
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows="4"
              placeholder="Enter maintenance details..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-colors"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-500 dark:to-amber-500 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 dark:hover:from-orange-600 dark:hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Maintenance
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/maintenances")}
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

export default MaintenanceCreate;
