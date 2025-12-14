import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripSchema } from "../../validation/trip.schema";
import { tripService } from "../../services/trip.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { userService } from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { MapPin, Save, X, Loader2, Calendar, Truck, User, Navigation, FileText } from "lucide-react";

const TripCreate = () => {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      mileageAtDeparture: 0,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [trucksResponse, trailersResponse, usersResponse] = await Promise.all([
        truckService.getAll(),
        trailerService.getAll(),
        userService.getAll(),
      ]);
      
      // Extract arrays from response objects, with fallback to empty arrays
      const trucksData = Array.isArray(trucksResponse) 
        ? trucksResponse 
        : (trucksResponse?.trucks || []);
      const trailersData = Array.isArray(trailersResponse) 
        ? trailersResponse 
        : (trailersResponse?.trailers || []);
      const usersData = Array.isArray(usersResponse) 
        ? usersResponse 
        : (usersResponse?.users || []);
      
      setTrucks(trucksData);
      setTrailers(trailersData);
      setDrivers(usersData.filter(u => u.role === "chauffeur" && u.accountStatus === "approved"));
    } catch (error) {
      toast.error("Failed to load data");
      // Ensure arrays are always set, even on error
      setTrucks([]);
      setTrailers([]);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      data.mileageAtDeparture = parseInt(data.mileageAtDeparture);
      await tripService.create(data);
      toast.success("Trip created successfully");
      navigate("/trips");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create trip");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Navigation className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Trip</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Fill in the details to create a new trip</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Truck className="w-4 h-4" />
              Truck *
            </label>
            <select
              {...register("assignedTruck")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select truck</option>
              {trucks.map(t => (
                <option key={t._id} value={t._id}>{t.matricule}</option>
              ))}
            </select>
            {errors.assignedTruck && <p className="mt-2 text-sm text-red-600">{errors.assignedTruck.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Truck className="w-4 h-4" />
              Trailer (Optional)
            </label>
            <select
              {...register("assignedTrailer")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No trailer</option>
              {trailers.map(t => (
                <option key={t._id} value={t._id}>{t.matricule}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4" />
              Driver *
            </label>
            <select
              {...register("assignedDriver")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select driver</option>
              {drivers.map(d => (
                <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>
              ))}
            </select>
            {errors.assignedDriver && <p className="mt-2 text-sm text-red-600">{errors.assignedDriver.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4" />
              Start Point *
            </label>
            <input
              type="text"
              {...register("startPoint")}
              placeholder="City, Country"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.startPoint && <p className="mt-2 text-sm text-red-600">{errors.startPoint.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4" />
              Destination *
            </label>
            <input
              type="text"
              {...register("destinationPoint")}
              placeholder="City, Country"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.destinationPoint && <p className="mt-2 text-sm text-red-600">{errors.destinationPoint.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4" />
              Departure Date *
            </label>
            <input
              type="datetime-local"
              {...register("departureDate")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.departureDate && <p className="mt-2 text-sm text-red-600">{errors.departureDate.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4" />
              Expected Arrival *
            </label>
            <input
              type="datetime-local"
              {...register("expectedArrivalDate")}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.expectedArrivalDate && <p className="mt-2 text-sm text-red-600">{errors.expectedArrivalDate.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Navigation className="w-4 h-4" />
              Mileage at Departure *
            </label>
            <input
              type="number"
              {...register("mileageAtDeparture", { valueAsNumber: true })}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.mileageAtDeparture && <p className="mt-2 text-sm text-red-600">{errors.mileageAtDeparture.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4" />
              Driver Remarks
            </label>
            <textarea
              {...register("driverRemarks")}
              rows={3}
              placeholder="Any additional notes..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/trips")}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? "Creating..." : "Create Trip"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripCreate;
