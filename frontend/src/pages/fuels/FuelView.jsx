import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fuelService } from "../../services/fuel.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Truck,
  User,
  Route,
  Droplet,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react";

const FuelView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fuel, setFuel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useApp();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchFuel();
  }, [id]);

  const fetchFuel = async () => {
    try {
      setLoading(true);
      const data = await fuelService.getOne(id);
      setFuel(data);
    } catch (error) {
      showError("Failed to fetch fuel record details");
      navigate("/fuels");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this fuel record?")) {
      return;
    }

    try {
      await fuelService.delete(id);
      showSuccess("Fuel record deleted successfully");
      navigate("/fuels");
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to delete fuel record"
      );
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading fuel record details...
          </p>
        </div>
      </div>
    );
  }

  if (!fuel) {
    return (
      <div className="text-center py-12">
        <Droplet className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Fuel record not found
        </p>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Fuel Record Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View fuel transaction information
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/fuels"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Link>
          {userRole === "admin" && (
            <>
              <Link
                to={`/fuels/${id}/edit`}
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
      </div>{" "}
      {/* Fuel Information */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Fuel Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date of Operation
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {new Date(fuel.dateOfOperation).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MapPin className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fuel Station Location
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {fuel.fuelStationLocation}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vehicle
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {fuel.linkedVehicle?.matricule || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Driver</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {fuel.linkedDriver?.name || "N/A"}
              </p>
            </div>
          </div>

          {fuel.linkedTrip && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg md:col-span-2">
              <Route className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Related Trip
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {fuel.linkedTrip?.tripNumber || fuel.linkedTrip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>{" "}
      {/* Fuel Details */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Fuel Details
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl border border-blue-200 dark:border-blue-800">
            <Droplet className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Quantity
            </p>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              {fuel.quantity?.toFixed(2)} <span className="text-lg">L</span>
            </p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <DollarSign className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Price per Litre
            </p>
            <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
              ${fuel.pricePerLitre?.toFixed(2)}
            </p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl border border-green-200 dark:border-green-800">
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Cost
            </p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400">
              ${fuel.totalCost?.toFixed(2)}
            </p>
          </div>
        </div>

        {fuel.notes && (
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                Notes
              </p>
            </div>
            <p className="text-base text-gray-700 dark:text-gray-300">
              {fuel.notes}
            </p>
          </div>
        )}
      </div>{" "}
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
              {new Date(fuel.createdAt).toLocaleString()}
            </p>
          </div>{" "}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Updated
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {new Date(fuel.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelView;
