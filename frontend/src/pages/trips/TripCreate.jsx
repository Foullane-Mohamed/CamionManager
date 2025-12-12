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
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trucksData, trailersData, usersData] = await Promise.all([
          truckService.getAll(),
          trailerService.getAll(),
          userService.getAll(),
        ]);

        setTrucks(trucksData);
        setTrailers(trailersData);
        setDrivers(usersData.filter((u) => u.role === "chauffeur"));
      } catch (error) {
        toast.error("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const onSubmit = async (data) => {
    try {
      await tripService.create(data);
      toast.success("Trip created successfully");
      navigate("/trips");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create trip");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Trip</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Trip Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Point *
              </label>
              <input
                type="text"
                {...register("startPoint")}
                placeholder="e.g., Casablanca, Morocco"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.startPoint && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startPoint.message}
                </p>
              )}
            </div>

            {/* Destination Point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination Point *
              </label>
              <input
                type="text"
                {...register("destinationPoint")}
                placeholder="e.g., Marrakech, Morocco"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.destinationPoint && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.destinationPoint.message}
                </p>
              )}
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departure Date *
              </label>
              <input
                type="datetime-local"
                {...register("departureDate")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.departureDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.departureDate.message}
                </p>
              )}
            </div>

            {/* Expected Arrival Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Arrival Date *
              </label>
              <input
                type="datetime-local"
                {...register("expectedArrivalDate")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.expectedArrivalDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expectedArrivalDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Assignment Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assigned Truck */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Truck *
              </label>
              <select
                {...register("assignedTruck")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Truck</option>
                {trucks.map((truck) => (
                  <option key={truck._id} value={truck._id}>
                    {truck.matricule} - {truck.brand} {truck.model}
                  </option>
                ))}
              </select>
              {errors.assignedTruck && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.assignedTruck.message}
                </p>
              )}
            </div>

            {/* Assigned Trailer (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Trailer (Optional)
              </label>
              <select
                {...register("assignedTrailer")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Trailer</option>
                {trailers.map((trailer) => (
                  <option key={trailer._id} value={trailer._id}>
                    {trailer.matricule} - {trailer.type}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned Driver */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Driver *
              </label>
              <select
                {...register("assignedDriver")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name}
                  </option>
                ))}
              </select>
              {errors.assignedDriver && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.assignedDriver.message}
                </p>
              )}
            </div>

            {/* Mileage at Departure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mileage at Departure (km) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("mileageAtDeparture", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.mileageAtDeparture && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mileageAtDeparture.message}
                </p>
              )}
            </div>
          </div>

          {/* Driver Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver Remarks (Optional)
            </label>
            <textarea
              {...register("driverRemarks")}
              rows="3"
              placeholder="Additional notes about the trip..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/trips")}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Creating..." : "Create Trip"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripCreate;
