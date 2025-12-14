import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { truckService } from "../../services/truck.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Truck as TruckIcon,
  Tag,
  Calendar,
  Gauge,
  Activity,
  FileText,
  Clock,
  Fuel,
  CheckCircle,
  XCircle,
  Wrench,
} from "lucide-react";

const TruckView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useApp();
  const { userRole } = useAuth();
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTruck = useCallback(async () => {
    try {
      const data = await truckService.getOne(id);
      setTruck(data);
    } catch {
      showError("Failed to fetch truck details");
      navigate("/trucks");
    } finally {
      setLoading(false);
    }
  }, [id, showError, navigate]);

  useEffect(() => {
    fetchTruck();
  }, [fetchTruck]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete truck ${truck.matricule}?`
      )
    ) {
      return;
    }

    try {
      await truckService.delete(id);
      showSuccess("Truck deleted successfully");
      navigate("/trucks");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete truck");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Disponible":
        return {
          bg: "bg-green-100 dark:bg-green-950",
          text: "text-green-800 dark:text-green-300",
          border: "border-green-200 dark:border-green-800",
          icon: CheckCircle,
        };
      case "En Mission":
        return {
          bg: "bg-blue-100 dark:bg-blue-950",
          text: "text-blue-800 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-800",
          icon: Activity,
        };
      case "En Maintenance":
        return {
          bg: "bg-red-100 dark:bg-red-950",
          text: "text-red-800 dark:text-red-300",
          border: "border-red-200 dark:border-red-800",
          icon: Wrench,
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
            Loading truck details...
          </p>
        </div>
      </div>
    );
  }

  if (!truck) {
    return (
      <div className="text-center py-12">
        <TruckIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Truck not found</p>
      </div>
    );
  }

  const statusStyle = getStatusStyle(truck.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 rounded-xl flex items-center justify-center shadow-lg">
            <TruckIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Truck Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {truck.matricule}
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/trucks"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Link>
          {userRole === "admin" && (
            <>
              <Link
                to={`/trucks/${id}/edit`}
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

      {/* Vehicle Information */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Vehicle Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Matricule
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {truck.matricule}
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
                {truck.status}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Brand</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {truck.brand}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {truck.model}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {truck.yearOfManufacture}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Fuel className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fuel Type
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {truck.fuelType}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mileage Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Current Mileage
          </h2>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl border border-blue-200 dark:border-blue-800">
          <Gauge className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
            {truck.currentMileage?.toLocaleString()}{" "}
            <span className="text-lg">km</span>
          </p>
        </div>
      </div>

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
              {new Date(truck.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Updated
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {new Date(truck.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckView;
