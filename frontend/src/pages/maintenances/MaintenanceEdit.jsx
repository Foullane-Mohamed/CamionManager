import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maintenanceUpdateSchema } from "../../validation/maintenance.schema";
import { maintenanceService } from "../../services/maintenance.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

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
    resolver: zodResolver(maintenanceUpdateSchema),
  });
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load maintenance data and vehicles in parallel
      const [maintenanceData, trucksResponse, trailersResponse] =
        await Promise.all([
          maintenanceService.getOne(id),
          truckService.getAll(),
          trailerService.getAll(),
        ]);

      // Safely extract array from response
      const extractArray = (response, keys = []) => {
        if (Array.isArray(response)) return response;
        for (const key of keys) {
          if (response && Array.isArray(response[key])) return response[key];
        }
        return [];
      };

      const trucks = extractArray(trucksResponse, ["trucks", "data"]);
      const trailers = extractArray(trailersResponse, ["trailers", "data"]);

      // Set vehicles
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
    } catch {
      toast.error("Failed to load maintenance data");
      navigate("/maintenances");
    } finally {
      setLoading(false);
    }
  }, [id, setValue, navigate, user?._id]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  const onSubmit = async (data) => {
    try {
      // Don't send performedBy - backend doesn't accept it for updates
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
        <p className="text-gray-500">Loading maintenance data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Maintenance Record</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            Maintenance Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Maintenance Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Type *
              </label>
              <select
                {...register("maintenanceType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Oil Change">Oil Change</option>
                <option value="Tire Replacement">Tire Replacement</option>
                <option value="Vehicle Revision">Vehicle Revision</option>
                <option value="Other">Other</option>
              </select>
              {errors.maintenanceType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.maintenanceType.message}
                </p>
              )}
            </div>

            {/* Linked Vehicle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle *
              </label>{" "}
              <select
                {...register("linkedVehicle")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                <p className="mt-1 text-sm text-red-600">
                  {errors.linkedVehicle.message}
                </p>
              )}
            </div>

            {/* Maintenance Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Date *
              </label>
              <input
                type="datetime-local"
                {...register("maintenanceDate")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.maintenanceDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.maintenanceDate.message}
                </p>
              )}
            </div>

            {/* Vehicle Mileage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Mileage (km) *
              </label>
              <input
                type="number"
                {...register("vehicleMileageAtMaintenance", {
                  valueAsNumber: true,
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.vehicleMileageAtMaintenance && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.vehicleMileageAtMaintenance.message}
                </p>
              )}
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("cost", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.cost && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cost.message}
                </p>
              )}
            </div>

            {/* Service Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Provider *
              </label>
              <input
                type="text"
                {...register("serviceProvider")}
                placeholder="Garage or service center name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.serviceProvider && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.serviceProvider.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Next Maintenance Due Mileage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Maintenance Due Mileage (km)
              </label>
              <input
                type="number"
                {...register("nextMaintenanceDueMileage", {
                  valueAsNumber: true,
                })}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.nextMaintenanceDueMileage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nextMaintenanceDueMileage.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Detailed description of maintenance work"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                {...register("remarks")}
                rows={2}
                placeholder="Additional notes or remarks"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.remarks && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.remarks.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Maintenance Record"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/maintenances/${id}`)}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceEdit;
