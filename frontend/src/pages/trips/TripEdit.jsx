import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripUpdateSchema } from "../../validation/trip.schema";
import { tripService } from "../../services/trip.service";
import { truckService } from "../../services/truck.service";
import { trailerService } from "../../services/trailer.service";
import { userService } from "../../services/user.service";
import { toast } from "react-toastify";

const TripEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tripUpdateSchema),
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load trip data and related data in parallel
      const [tripData, trucksData, trailersData, usersData] = await Promise.all(
        [
          tripService.getOne(id),
          truckService.getAll(),
          trailerService.getAll(),
          userService.getAll(),
        ]
      );

      setTrucks(trucksData);
      setTrailers(trailersData);
      setDrivers(usersData.filter((u) => u.role === "chauffeur"));

      // Set form values
      setValue("startPoint", tripData.startPoint);
      setValue("destinationPoint", tripData.destinationPoint);
      setValue(
        "departureDate",
        new Date(tripData.departureDate).toISOString().slice(0, 16)
      );
      setValue(
        "expectedArrivalDate",
        new Date(tripData.expectedArrivalDate).toISOString().slice(0, 16)
      );
      setValue(
        "actualArrivalDate",
        tripData.actualArrivalDate
          ? new Date(tripData.actualArrivalDate).toISOString().slice(0, 16)
          : ""
      );
      setValue("status", tripData.status);
      setValue(
        "assignedTruck",
        tripData.assignedTruck?._id || tripData.assignedTruck
      );
      setValue(
        "assignedTrailer",
        tripData.assignedTrailer?._id || tripData.assignedTrailer || ""
      );
      setValue(
        "assignedDriver",
        tripData.assignedDriver?._id || tripData.assignedDriver
      );
      setValue("mileageAtDeparture", tripData.mileageAtDeparture);
      setValue("mileageAtArrival", tripData.mileageAtArrival || "");
      setValue("driverRemarks", tripData.driverRemarks || "");
    } catch (error) {
      toast.error("Failed to load trip data");
      navigate("/trips");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await tripService.update(id, data);
      toast.success("Trip updated successfully");
      navigate("/trips");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update trip");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading trip data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Trip</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Trip Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Point
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
                Destination Point
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
                Departure Date
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
                Expected Arrival Date
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

            {/* Actual Arrival Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Arrival Date (Optional)
              </label>
              <input
                type="datetime-local"
                {...register("actualArrivalDate")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="À faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
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
                Assigned Truck
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
                Assigned Driver
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
            </div>

            {/* Mileage at Departure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mileage at Departure (km)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("mileageAtDeparture", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mileage at Arrival */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mileage at Arrival (km) (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("mileageAtArrival", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
            {isSubmitting ? "Updating..." : "Update Trip"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripEdit;
