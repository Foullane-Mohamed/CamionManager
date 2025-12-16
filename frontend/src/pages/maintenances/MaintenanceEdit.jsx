import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maintenanceSchema } from "../../validation/maintenance.schema";
import { maintenanceService } from "../../services/maintenance.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { useApp } from "../../context/AppContext";
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

const MaintenanceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useApp();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(maintenanceSchema),  });  const selectedVehicleId = watch("linkedVehicle");

  useEffect(() => {
    if (selectedVehicleId && vehicles.length > 0) {
      const selectedVehicle = vehicles.find(v => v._id === selectedVehicleId);
      if (selectedVehicle && selectedVehicle.currentMileage) {
        setValue("vehicleMileageAtMaintenance", selectedVehicle.currentMileage);
      }
    }
  }, [selectedVehicleId, vehicles, setValue]);

  useEffect(() => {
    const loadData = async () => {
      try {        setLoading(true);

        const [maintenanceData, trucksResponse, trailersResponse] =
          await Promise.all([
            maintenanceService.getOne(id),
            truckService.getAll(),
            trailerService.getAll(),
          ]);

        const extractArray = (response, keys = []) => {
          if (Array.isArray(response)) return response;
          for (const key of keys) {
            if (response && Array.isArray(response[key])) return response[key];
          }
          return [];
        };        const trucks = extractArray(trucksResponse, ["trucks", "data"]);
        const trailers = extractArray(trailersResponse, ["trailers", "data"]);

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
          })),
        ];
        setVehicles(allVehicles);

        const maintenanceRecord = maintenanceData.data || maintenanceData;
        setMaintenance(maintenanceRecord);

        const formattedDate = maintenanceRecord.maintenanceDate
          ? new Date(maintenanceRecord.maintenanceDate).toISOString().split("T")[0]
          : "";

        reset({
          maintenanceType: maintenanceRecord.maintenanceType,
          linkedVehicle: maintenanceRecord.linkedVehicle?._id || maintenanceRecord.linkedVehicle,
          maintenanceDate: formattedDate,
          vehicleMileageAtMaintenance: maintenanceRecord.vehicleMileageAtMaintenance,
          cost: maintenanceRecord.cost,
          serviceProvider: maintenanceRecord.serviceProvider,
          status: maintenanceRecord.status,
          description: maintenanceRecord.description || "",
        });
      } catch (error) {
        showError(
          error.response?.data?.message || "Failed to load maintenance record"
        );
        navigate("/maintenances");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate, showError, reset, setValue]);  const onSubmit = async (data) => {
    try {
      await maintenanceService.update(id, data);
      showSuccess("Maintenance record updated successfully");
      navigate("/maintenances");
    } catch (error) {
      showError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update maintenance record"
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </div>
    );
  }

  if (!maintenance) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200">
              Maintenance record not found
            </p>
          </div>
        </div>
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
            Edit Maintenance Record
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update the maintenance details
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
            </label>
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
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Maintenance
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

export default MaintenanceEdit;
