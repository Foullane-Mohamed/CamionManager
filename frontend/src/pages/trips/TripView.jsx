import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { tripService } from "../../services/trip.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const TripView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useApp();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const data = await tripService.getOne(id);
      setTrip(data);
    } catch (error) {
      showError("Failed to fetch trip details");
      navigate("/trips");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete trip ${trip.tripNumber}?`
      )
    ) {
      return;
    }

    try {
      await tripService.delete(id);
      showSuccess("Trip deleted successfully");
      navigate("/trips");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete trip");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "À faire":
        return "bg-yellow-100 text-yellow-800";
      case "En cours":
        return "bg-blue-100 text-blue-800";
      case "Terminé":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading trip details...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Trip not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trip Details</h1>
        <div className="flex gap-3">
          <Link
            to="/trips"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to List
          </Link>
          {userRole === "admin" && (
            <>
              <Link
                to={`/trips/${id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Trip Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Trip Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Trip Number</p>
            <p className="text-lg font-medium">{trip.tripNumber}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                trip.status
              )}`}
            >
              {trip.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Start Point</p>
            <p className="text-lg font-medium">{trip.startPoint}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Destination Point</p>
            <p className="text-lg font-medium">{trip.destinationPoint}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Departure Date</p>
            <p className="text-lg font-medium">
              {new Date(trip.departureDate).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Expected Arrival Date</p>
            <p className="text-lg font-medium">
              {new Date(trip.expectedArrivalDate).toLocaleString()}
            </p>
          </div>

          {trip.actualArrivalDate && (
            <div>
              <p className="text-sm text-gray-500">Actual Arrival Date</p>
              <p className="text-lg font-medium">
                {new Date(trip.actualArrivalDate).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Assignment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Assigned Truck</p>
            <p className="text-lg font-medium">
              {trip.assignedTruck?.matricule || "N/A"}
            </p>
          </div>

          {trip.assignedTrailer && (
            <div>
              <p className="text-sm text-gray-500">Assigned Trailer</p>
              <p className="text-lg font-medium">
                {trip.assignedTrailer?.matricule || "N/A"}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">Assigned Driver</p>
            <p className="text-lg font-medium">
              {trip.assignedDriver?.name || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Mileage & Distance */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Mileage & Distance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Mileage at Departure</p>
            <p className="text-2xl font-bold text-blue-600">
              {trip.mileageAtDeparture?.toLocaleString()} km
            </p>
          </div>

          {trip.mileageAtArrival && (
            <div>
              <p className="text-sm text-gray-500">Mileage at Arrival</p>
              <p className="text-2xl font-bold text-green-600">
                {trip.mileageAtArrival?.toLocaleString()} km
              </p>
            </div>
          )}

          {trip.distance && (
            <div>
              <p className="text-sm text-gray-500">Trip Distance</p>
              <p className="text-2xl font-bold text-indigo-600">
                {trip.distance?.toLocaleString()} km
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Driver Remarks */}
      {trip.driverRemarks && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Driver Remarks</h2>
          <p className="text-base bg-gray-50 p-4 rounded-md">
            {trip.driverRemarks}
          </p>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Record Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-base">
              {new Date(trip.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-base">
              {new Date(trip.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripView;
