import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fuelSchema } from "../../validation/fuel.schema";
import { fuelService } from "../../services/fuel.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { userService } from "../../services/user.service";
import { tripService } from "../../services/trip.service";
import { useApp } from "../../context/AppContext";
import {
  Droplet,
  Save,
  X,
  Loader2,
  Calendar,
  MapPin,
  Truck,
  User,
  Route,
  DollarSign,
  Gauge,
  AlertCircle,
} from "lucide-react";

const FuelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useApp();
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fuel, setFuel] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(fuelSchema),
  });

  const quantity = watch("quantity");
  const pricePerLitre = watch("pricePerLitre");

  useEffect(() => {
    const total =
      (parseFloat(quantity) || 0) * (parseFloat(pricePerLitre) || 0);
    setValue("totalCost", parseFloat(total.toFixed(2)));
  }, [quantity, pricePerLitre, setValue]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [
          fuelData,
          trucksResponse,
          trailersResponse,
          driversResponse,
          tripsResponse,
        ] = await Promise.all([
          fuelService.getOne(id),
          truckService.getAll(),
          trailerService.getAll(),
          userService.getAll(),
          tripService.getAll(),
        ]);

        const extractArray = (response, keys = []) => {
          if (Array.isArray(response)) return response;
          for (const key of keys) {
            if (response && Array.isArray(response[key])) return response[key];
          }
          return [];
        };

        const trucksData = extractArray(trucksResponse, ["trucks", "data"]);
        const trailersData = extractArray(trailersResponse, [
          "trailers",
          "data",
        ]);
        const driversData = extractArray(driversResponse, ["users", "data"]);
        const tripsData = extractArray(tripsResponse, ["trips", "data"]);

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

        const fuelRecord = fuelData.data || fuelData;
        setFuel(fuelRecord);

        const formattedDate = fuelRecord.dateOfOperation
          ? new Date(fuelRecord.dateOfOperation).toISOString().split("T")[0]
          : "";

        reset({
          dateOfOperation: formattedDate,
          fuelStationLocation: fuelRecord.fuelStationLocation,
          linkedVehicle: fuelRecord.linkedVehicle?._id || fuelRecord.linkedVehicle,
          linkedDriver: fuelRecord.linkedDriver?._id || fuelRecord.linkedDriver,
          linkedTrip: fuelRecord.linkedTrip?._id || fuelRecord.linkedTrip || "",
          quantity: fuelRecord.quantity,
          pricePerLitre: fuelRecord.pricePerLitre,
          totalCost: fuelRecord.totalCost,
        });
      } catch (error) {
        showError(
          error.response?.data?.message || "Failed to load fuel record"
        );
        navigate("/fuels");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate, reset, showError]);

  const onSubmit = async (data) => {
    try {
      await fuelService.update(id, data);
      showSuccess("Fuel record updated successfully");
      navigate("/fuels");
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to update fuel record"
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!fuel) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200">
              Fuel record not found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Droplet className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Fuel Record
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update the fuel transaction details
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
              htmlFor="dateOfOperation"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Calendar className="w-4 h-4" />
              Date of Operation *
            </label>
            <input
              id="dateOfOperation"
              type="date"
              {...register("dateOfOperation")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.dateOfOperation && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.dateOfOperation.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="fuelStationLocation"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <MapPin className="w-4 h-4" />
              Fuel Station Location *
            </label>
            <input
              id="fuelStationLocation"
              type="text"
              {...register("fuelStationLocation")}
              placeholder="Station name or address"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.fuelStationLocation && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.fuelStationLocation.message}
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
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
              htmlFor="linkedDriver"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <User className="w-4 h-4" />
              Driver *
            </label>
            <select
              id="linkedDriver"
              {...register("linkedDriver")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            >
              <option value="">Select driver</option>
              {Array.isArray(drivers) &&
                drivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name}
                  </option>
                ))}
            </select>
            {errors.linkedDriver && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.linkedDriver.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="linkedTrip"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Route className="w-4 h-4" />
              Trip (Optional)
            </label>
            <select
              id="linkedTrip"
              {...register("linkedTrip")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            >
              <option value="">Select trip (optional)</option>
              {Array.isArray(trips) &&
                trips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.tripNumber} - {trip.startPoint} →{" "}
                    {trip.destinationPoint}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Gauge className="w-4 h-4" />
              Quantity (Liters) *
            </label>
            <input
              id="quantity"
              type="number"
              step="0.01"
              {...register("quantity", { valueAsNumber: true })}
              placeholder="50.00"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.quantity && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="pricePerLitre"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <DollarSign className="w-4 h-4" />
              Price per Liter *
            </label>
            <input
              id="pricePerLitre"
              type="number"
              step="0.01"
              {...register("pricePerLitre", { valueAsNumber: true })}
              placeholder="1.50"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            />
            {errors.pricePerLitre && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.pricePerLitre.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="totalCost"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <DollarSign className="w-4 h-4" />
              Total Cost (Auto-calculated)
            </label>
            <input
              id="totalCost"
              type="number"
              step="0.01"
              {...register("totalCost", { valueAsNumber: true })}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-lg focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
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
                Update Fuel Record
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/fuels")}
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

export default FuelEdit;
