import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fuelSchema } from "../../validation/fuel.schema";
import { fuelService } from "../../services/fuel.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { userService } from "../../services/user.service";
import { tripService } from "../../services/trip.service";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
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
} from "lucide-react";

const FuelCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(fuelSchema),
    defaultValues: {
      linkedDriver: user?._id || "",
      quantity: 0,
      pricePerLitre: 0,
      totalCost: 0,
    },
  });

  const quantity = watch("quantity");
  const pricePerLitre = watch("pricePerLitre");

  // Auto-calculate total cost
  useEffect(() => {
    const total =
      (parseFloat(quantity) || 0) * (parseFloat(pricePerLitre) || 0);
    setValue("totalCost", parseFloat(total.toFixed(2)));
  }, [quantity, pricePerLitre, setValue]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          trucksResponse,
          trailersResponse,
          driversResponse,
          tripsResponse,
        ] = await Promise.all([
          truckService.getAll(),
          trailerService.getAll(),
          userService.getAll(),
          tripService.getAll(),
        ]);

        // Safely extract array from response
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
        const usersData = extractArray(driversResponse, ["users", "data"]);
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
        setDrivers(usersData.filter((u) => u.role === "chauffeur"));
        setTrips(tripsData);
        console.log("Loaded form data:", {
          vehicles: allVehicles.length,
          drivers: usersData.filter((u) => u.role === "chauffeur").length,
          trips: tripsData.length,
        });
      } catch (error) {
        console.error("Error loading form data:", error);
        toast.error(
          "Failed to load form data. Please ensure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const onSubmit = async (data) => {
    try {
      await fuelService.create(data);
      toast.success("Fuel record created successfully");
      navigate("/fuels");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create fuel record"
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Droplet className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add Fuel Record
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Record a new fuel transaction
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
              {drivers.map((driver) => (
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
              {trips.map((trip) => (
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
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Fuel Record
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

export default FuelCreate;
