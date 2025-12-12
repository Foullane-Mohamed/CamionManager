import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fuelUpdateSchema } from "../../validation/fuel.schema";
import { fuelService } from "../../services/fuel.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { userService } from "../../services/user.service";
import { tripService } from "../../services/trip.service";
import { toast } from "react-toastify";

const FuelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(fuelUpdateSchema),
  });

  const quantity = watch("quantity");
  const pricePerLitre = watch("pricePerLitre");

  // Auto-calculate total cost
  useEffect(() => {
    if (quantity !== undefined && pricePerLitre !== undefined) {
      const total =
        (parseFloat(quantity) || 0) * (parseFloat(pricePerLitre) || 0);
      setValue("totalCost", parseFloat(total.toFixed(2)));
    }
  }, [quantity, pricePerLitre, setValue]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load fuel data and related data in parallel
      const [fuelData, trucksData, trailersData, driversData, tripsData] =
        await Promise.all([
          fuelService.getOne(id),
          truckService.getAll(),
          trailerService.getAll(),
          userService.getAll(),
          tripService.getAll(),
        ]);

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
      setDrivers(driversData.filter((u) => u.role === "chauffeur"));
      setTrips(tripsData);

      // Set form values
      setValue("quantity", fuelData.quantity);
      setValue("totalCost", fuelData.totalCost);
      setValue("pricePerLitre", fuelData.pricePerLitre);
      setValue("fuelStationLocation", fuelData.fuelStationLocation);
      setValue(
        "dateOfOperation",
        new Date(fuelData.dateOfOperation).toISOString().slice(0, 16)
      );
      setValue(
        "linkedTrip",
        fuelData.linkedTrip?._id || fuelData.linkedTrip || ""
      );
      setValue(
        "linkedDriver",
        fuelData.linkedDriver?._id || fuelData.linkedDriver
      );
      setValue(
        "linkedVehicle",
        fuelData.linkedVehicle?._id || fuelData.linkedVehicle
      );
      setValue("notes", fuelData.notes || "");
    } catch (error) {
      toast.error("Failed to load fuel record data");
      navigate("/fuels");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await fuelService.update(id, data);
      toast.success("Fuel record updated successfully");
      navigate("/fuels");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update fuel record"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading fuel record...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Fuel Record</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Fuel Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date of Operation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Operation *
              </label>
              <input
                type="datetime-local"
                {...register("dateOfOperation")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dateOfOperation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfOperation.message}
                </p>
              )}
            </div>

            {/* Fuel Station Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Station Location *
              </label>
              <input
                type="text"
                {...register("fuelStationLocation")}
                placeholder="e.g., Shell Station - Casablanca"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fuelStationLocation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fuelStationLocation.message}
                </p>
              )}
            </div>

            {/* Vehicle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle *
              </label>
              <select
                {...register("linkedVehicle")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.label}
                  </option>
                ))}
              </select>
              {errors.linkedVehicle && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.linkedVehicle.message}
                </p>
              )}
            </div>

            {/* Driver */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver *
              </label>
              <select
                {...register("linkedDriver")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name}
                  </option>
                ))}
              </select>
              {errors.linkedDriver && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.linkedDriver.message}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (Litres) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("quantity", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            {/* Price per Litre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Litre *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("pricePerLitre", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.pricePerLitre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pricePerLitre.message}
                </p>
              )}
            </div>

            {/* Total Cost (Read-only, auto-calculated) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Cost (Auto-calculated)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("totalCost", { valueAsNumber: true })}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            {/* Linked Trip (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Trip (Optional)
              </label>
              <select
                {...register("linkedTrip")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Trip</option>
                {trips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.tripNumber} - {trip.startPoint} →{" "}
                    {trip.destinationPoint}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              rows="3"
              placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/fuels")}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Updating..." : "Update Fuel Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FuelEdit;
