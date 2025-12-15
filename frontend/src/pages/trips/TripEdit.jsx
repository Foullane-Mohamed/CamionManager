import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripSchema } from "../../validation/trip.schema";
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
    resolver: zodResolver(tripSchema),
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [tripData, trucksData, trailersData, usersData] = await Promise.all([
        tripService.getOne(id),
        truckService.getAll(),
        trailerService.getAll(),
        userService.getAll(),
      ]);

      setTrucks(trucksData);
      setTrailers(trailersData);
      setDrivers(usersData.filter(u => u.role === "chauffeur" && u.accountStatus === "approved"));

      // Set form values
      setValue("assignedTruck", tripData.assignedTruck?._id || tripData.assignedTruck);
      setValue("assignedTrailer", tripData.assignedTrailer?._id || tripData.assignedTrailer || "");
      setValue("assignedDriver", tripData.assignedDriver?._id || tripData.assignedDriver);
      setValue("startPoint", tripData.startPoint);
      setValue("destinationPoint", tripData.destinationPoint);
      setValue("departureDate", new Date(tripData.departureDate).toISOString().slice(0, 16));
      setValue("expectedArrivalDate", new Date(tripData.expectedArrivalDate).toISOString().slice(0, 16));
      setValue("mileageAtDeparture", tripData.mileageAtDeparture);
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
      data.mileageAtDeparture = parseInt(data.mileageAtDeparture);
      await tripService.update(id, data);
      toast.success("Trip updated successfully");
      navigate(`/trips/${id}`);
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Truck *</label>
          <select {...register("assignedTruck")} className="w-full px-3 py-2 border rounded">
            <option value="">Select truck</option>
            {trucks.map(t => (
              <option key={t._id} value={t._id}>{t.matricule}</option>
            ))}
          </select>
          {errors.assignedTruck && <p className="text-red-600 text-sm">{errors.assignedTruck.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trailer (Optional)</label>
          <select {...register("assignedTrailer")} className="w-full px-3 py-2 border rounded">
            <option value="">No trailer</option>
            {trailers.map(t => (
              <option key={t._id} value={t._id}>{t.matricule}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Driver *</label>
          <select {...register("assignedDriver")} className="w-full px-3 py-2 border rounded">
            <option value="">Select driver</option>
            {drivers.map(d => (
              <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>
            ))}
          </select>
          {errors.assignedDriver && <p className="text-red-600 text-sm">{errors.assignedDriver.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Point *</label>
          <input type="text" {...register("startPoint")} className="w-full px-3 py-2 border rounded" />
          {errors.startPoint && <p className="text-red-600 text-sm">{errors.startPoint.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
          <input type="text" {...register("destinationPoint")} className="w-full px-3 py-2 border rounded" />
          {errors.destinationPoint && <p className="text-red-600 text-sm">{errors.destinationPoint.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date *</label>
          <input type="datetime-local" {...register("departureDate")} className="w-full px-3 py-2 border rounded" />
          {errors.departureDate && <p className="text-red-600 text-sm">{errors.departureDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Arrival *</label>
          <input type="datetime-local" {...register("expectedArrivalDate")} className="w-full px-3 py-2 border rounded" />
          {errors.expectedArrivalDate && <p className="text-red-600 text-sm">{errors.expectedArrivalDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mileage at Departure *</label>
          <input type="number" {...register("mileageAtDeparture", { valueAsNumber: true })} className="w-full px-3 py-2 border rounded" />
          {errors.mileageAtDeparture && <p className="text-red-600 text-sm">{errors.mileageAtDeparture.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Driver Remarks</label>
          <textarea {...register("driverRemarks")} rows={3} className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? "Updating..." : "Update Trip"}
          </button>
          <button type="button" onClick={() => navigate(`/trips/${id}`)} className="px-4 py-2 border rounded hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripEdit;
