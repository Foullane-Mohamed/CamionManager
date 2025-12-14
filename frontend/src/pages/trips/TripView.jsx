import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { tripService } from "../../services/trip.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Route,
  MapPin,
  Calendar,
  Truck,
  Container,
  User,
  Gauge,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  PlayCircle,
  Loader,
} from "lucide-react";

const TripView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useApp();
  const { userRole } = useAuth();

  const fetchTrip = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tripService.getOne(id);
      setTrip(data);
    } catch {
      showError("Failed to fetch trip details");
      navigate("/trips");
    } finally {
      setLoading(false);
    }
  }, [id, showError, navigate]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "À faire":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-950",
          text: "text-yellow-800 dark:text-yellow-300",
          border: "border-yellow-200 dark:border-yellow-800",
          icon: PlayCircle,
        };
      case "En cours":
        return {
          bg: "bg-blue-100 dark:bg-blue-950",
          text: "text-blue-800 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-800",
          icon: Loader,
        };
      case "Terminé":
        return {
          bg: "bg-green-100 dark:bg-green-950",
          text: "text-green-800 dark:text-green-300",
          border: "border-green-200 dark:border-green-800",
          icon: CheckCircle,
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-800 dark:text-gray-300",
          border: "border-gray-200 dark:border-gray-700",
          icon: XCircle,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading trip details...
          </p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <Route className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Trip not found</p>
      </div>
    );
  }

  const statusStyle = getStatusStyle(trip.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <Route className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trip Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {trip.tripNumber || "View trip information"}
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/trips"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Link>
          {userRole === "admin" && (
            <>
              <Link
                to={`/trips/${id}/edit`}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-md"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Trip Information */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Trip Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Trip Number
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {trip.tripNumber}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <StatusIcon className="w-5 h-5 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-lg ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}
              >
                {trip.status}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Start Point
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {trip.startPoint}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MapPin className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Destination Point
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {trip.destinationPoint}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Departure Date
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {new Date(trip.departureDate).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expected Arrival Date
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {new Date(trip.expectedArrivalDate).toLocaleString()}
              </p>
            </div>
          </div>

          {trip.actualArrivalDate && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg md:col-span-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Actual Arrival Date
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {new Date(trip.actualArrivalDate).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Details */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Assignment Details
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Assigned Truck
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {trip.assignedTruck?.matricule || "N/A"}
              </p>
            </div>
          </div>

          {trip.assignedTrailer && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Container className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Assigned Trailer
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {trip.assignedTrailer?.matricule || "N/A"}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Assigned Driver
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {trip.assignedDriver?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mileage & Distance */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Mileage & Distance
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl border border-blue-200 dark:border-blue-800">
            <Gauge className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Mileage at Departure
            </p>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              {trip.mileageAtDeparture?.toLocaleString()}{" "}
              <span className="text-lg">km</span>
            </p>
          </div>

          {trip.mileageAtArrival && (
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl border border-green-200 dark:border-green-800">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Mileage at Arrival
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                {trip.mileageAtArrival?.toLocaleString()}{" "}
                <span className="text-lg">km</span>
              </p>
            </div>
          )}

          {trip.distance && (
            <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <Route className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Trip Distance
              </p>
              <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
                {trip.distance?.toLocaleString()}{" "}
                <span className="text-lg">km</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Driver Remarks */}
      {trip.driverRemarks && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Driver Remarks
            </h2>
          </div>
          <p className="text-base text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            {trip.driverRemarks}
          </p>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Record Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Created At
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {new Date(trip.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Updated
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {new Date(trip.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripView;
