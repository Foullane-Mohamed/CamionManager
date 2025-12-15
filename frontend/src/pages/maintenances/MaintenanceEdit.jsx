import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maintenanceSchema } from "../../validation/maintenance.schema";
import { maintenanceService } from "../../services/maintenance.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  Wrench,
  Save,
  X,
  Loader2,
  Calendar,
  Truck,
  DollarSign,
  MapPin,
  FileText,
  AlertCircle,
} from "lucide-react";

const MaintenanceEdit = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(maintenanceSchema),
  });

  useEffect(() => {
    loadData();
  }, [id]); // Helper function to safely extract arrays from API responses
  const extractArray = (response, keys = []) => {
    if (Array.isArray(response)) return response;
    for (const key of keys) {
      if (response && Array.isArray(response[key])) return response[key];
    }
    return [];
  };
  const loadData = async () => {
    try {
      setLoading(true);

      // Load maintenance data and vehicles in parallel
      const [maintenanceResponse, trucksResponse, trailersResponse] =
        await Promise.all([
          maintenanceService.getOne(id),
          truckService.getAll(),
          trailerService.getAll(),
        ]);

      // Extract maintenance data (handle wrapped response)
      const maintenanceData =
        maintenanceResponse?.maintenance ||
        maintenanceResponse?.data ||
        maintenanceResponse;

      const trucksData = extractArray(trucksResponse, ["trucks", "data"]);
      const trailersData = extractArray(trailersResponse, ["trailers", "data"]);

      // Set vehicles
      const allVehicles = [
        ...trucksData.map((t) => ({
          ...t,
          type: "Truck",
          label: `${t.matricule} (Truck)`,
        })),
        ...trailersData.map((t) => ({
          ...t,
          type: "Trailer",
          label: `${t.matricule} (Trailer)`,
        })),
      ];
      setVehicles(allVehicles);

      // Set form values
      setValue("maintenanceType", maintenanceData.maintenanceType);
      setValue(
        "linkedVehicle",
        maintenanceData.linkedVehicle?._id || maintenanceData.linkedVehicle
      );
      setValue("linkedRule", maintenanceData.linkedRule || "");
      setValue(
        "maintenanceDate",
        new Date(maintenanceData.maintenanceDate).toISOString().slice(0, 16)
      );
      setValue(
        "vehicleMileageAtMaintenance",
        maintenanceData.vehicleMileageAtMaintenance
      );
      setValue(
        "nextMaintenanceDueDate",
        maintenanceData.nextMaintenanceDueDate
          ? new Date(maintenanceData.nextMaintenanceDueDate)
              .toISOString()
              .slice(0, 16)
          : ""
      );
      setValue(
        "nextMaintenanceDueMileage",
        maintenanceData.nextMaintenanceDueMileage || ""
      );
      setValue("cost", maintenanceData.cost);
      setValue("serviceProvider", maintenanceData.serviceProvider);
      setValue("description", maintenanceData.description || "");
      setValue("status", maintenanceData.status);
      setValue("remarks", maintenanceData.remarks || "");
      setValue("isAlertTriggered", maintenanceData.isAlertTriggered || false);
      setValue("alertType", maintenanceData.alertType || "Manual");
      setValue("performedBy", maintenanceData.performedBy?._id || user?._id);
    } catch (error) {
      console.error("Error loading maintenance data:", error);
      toast.error(
        error.response?.data?.message || "Failed to load maintenance data"
      );
      navigate("/maintenances");
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (data) => {
    try {
      data.performedBy = user?._id;

      await maintenanceService.update(id, data);
      toast.success("Maintenance record updated successfully");
      navigate(`/maintenances/${id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update maintenance record"
      );
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Wrench className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Maintenance Record
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update maintenance information
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Maintenance Type */}
          <div>
            <label
              htmlFor="maintenanceType"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Maintenance Type *
            </label>
            <select
              id="maintenanceType"
              {...register("maintenanceType")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
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

          {/* Linked Vehicle */}
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            >
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
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

          {/* Maintenance Date */}
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
              type="datetime-local"
              {...register("maintenanceDate")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.maintenanceDate && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.maintenanceDate.message}
              </p>
            )}
          </div>

          {/* Vehicle Mileage */}
          <div>
            <label
              htmlFor="vehicleMileageAtMaintenance"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <MapPin className="w-4 h-4" />
              Vehicle Mileage (km) *
            </label>
            <input
              id="vehicleMileageAtMaintenance"
              type="number"
              {...register("vehicleMileageAtMaintenance", {
                valueAsNumber: true,
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.vehicleMileageAtMaintenance && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.vehicleMileageAtMaintenance.message}
              </p>
            )}
          </div>

          {/* Cost */}
          <div>
            <label
              htmlFor="cost"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              Cost *
            </label>
            <input
              id="cost"
              type="number"
              step="0.01"
              {...register("cost", { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.cost && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.cost.message}
              </p>
            )}
          </div>

          {/* Service Provider */}
          <div>
            <label
              htmlFor="serviceProvider"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <MapPin className="w-4 h-4" />
              Service Provider *
            </label>
            <input
              id="serviceProvider"
              type="text"
              {...register("serviceProvider")}
              placeholder="Garage or service center name"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.serviceProvider && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.serviceProvider.message}
              </p>
            )}
          </div>

          {/* Status */}
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
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

          {/* Next Maintenance Due Mileage */}
          <div>
            <label
              htmlFor="nextMaintenanceDueMileage"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <MapPin className="w-4 h-4" />
              Next Maintenance Due Mileage (km)
            </label>
            <input
              id="nextMaintenanceDueMileage"
              type="number"
              {...register("nextMaintenanceDueMileage", {
                valueAsNumber: true,
              })}
              placeholder="Optional"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.nextMaintenanceDueMileage && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.nextMaintenanceDueMileage.message}
              </p>
            )}
          </div>

          {/* Description */}
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
              rows={3}
              placeholder="Detailed description of maintenance work"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label
              htmlFor="remarks"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <FileText className="w-4 h-4" />
              Remarks
            </label>
            <textarea
              id="remarks"
              {...register("remarks")}
              rows={2}
              placeholder="Additional notes or remarks"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.remarks && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.remarks.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Maintenance Record
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/maintenances/${id}`)}
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors inline-flex items-center gap-2"
          >
            {" "}
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceEdit;
