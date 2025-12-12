import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tireSchema } from "../../validation/tire.schema";
import { tireService } from "../../services/tire.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

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
      status: "Bon",
      associatedVehicleType: "Truck",
    },
  });

  const vehicleType = watch("associatedVehicleType");

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const [trucksData, trailersData] = await Promise.all([
          truckService.getAll(),
          trailerService.getAll(),
        ]);

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
      } catch (error) {
        toast.error("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, []);

  const onSubmit = async (data) => {
    try {
      await tireService.create(data);
      toast.success("Tire created successfully");
      navigate("/tires");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create tire");
    }
  };

  // Get position options based on vehicle type
  const getPositionOptions = () => {
    if (vehicleType === "Trailer") {
      return [
        "Trailer Front Left",
        "Trailer Front Right",
        "Trailer Rear Left",
        "Trailer Rear Right",
        "Spare",
      ];
    }
    return ["Front Left", "Front Right", "Rear Left", "Rear Right", "Spare"];
  };

  // Get filtered vehicles based on selected type
  const filteredVehicles = vehicles.filter((v) => v.type === vehicleType);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading vehicles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Tire</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Tire Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Serial Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number *
              </label>
              <input
                type="text"
                {...register("serialNumber")}
                placeholder="e.g., TIRE-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.serialNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.serialNumber.message}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <input
                type="text"
                {...register("brand")}
                placeholder="e.g., Michelin"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.brand.message}
                </p>
              )}
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size *
              </label>
              <input
                type="text"
                {...register("size")}
                placeholder="e.g., 315/80R22.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.size && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.size.message}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bon">Bon</option>
                <option value="À remplacer">À remplacer</option>
                <option value="Usé">Usé</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Installation Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installation Date *
              </label>
              <input
                type="date"
                {...register("installationDate")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.installationDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.installationDate.message}
                </p>
              )}
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Associated Vehicle Type *
              </label>
              <select
                {...register("associatedVehicleType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Truck">Truck</option>
                <option value="Trailer">Trailer</option>
              </select>
              {errors.associatedVehicleType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.associatedVehicleType.message}
                </p>
              )}
            </div>

            {/* Vehicle Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Position *
              </label>
              <select
                {...register("vehiclePosition")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Position</option>
                {getPositionOptions().map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              {errors.vehiclePosition && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.vehiclePosition.message}
                </p>
              )}
            </div>

            {/* Associated Vehicle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Associated Vehicle *
              </label>
              <select
                {...register("associatedVehicleId")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Vehicle</option>
                {filteredVehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.label}
                  </option>
                ))}
              </select>
              {errors.associatedVehicleId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.associatedVehicleId.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/tires")}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Creating..." : "Create Tire"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TireCreate;
