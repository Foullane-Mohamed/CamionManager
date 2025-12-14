import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { maintenanceService } from "../../services/maintenance.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Wrench,
  Calendar,
  DollarSign,
  Truck,
  FileText,
  Clock,
  Settings,
  AlertCircle,
  Loader2,
} from "lucide-react";

const MaintenanceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useApp();
  const { userRole } = useAuth();

  const fetchMaintenance = useCallback(async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getOne(id);
      setMaintenance(data);
    } catch {
      showError("Failed to fetch maintenance details");
      navigate("/maintenances");
    } finally {
      setLoading(false);
    }
  }, [id, showError, navigate]);

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete maintenance record ${maintenance.maintenanceNumber}?`
      )
    ) {
      return;
    }

    try {
      await maintenanceService.delete(id);
      showSuccess("Maintenance record deleted successfully");
      navigate("/maintenances");
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to delete maintenance record"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 dark:border-orange-400"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading maintenance details...
          </p>
        </div>
      </div>
    );
  }

  if (!maintenance) {
    return (
      <div className="text-center py-12">
        <Wrench className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Maintenance record not found
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 dark:from-orange-600 dark:to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Maintenance Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {maintenance.maintenanceNumber || "View maintenance record"}
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/maintenances"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Link>
          {userRole === "admin" && (
            <>
              <Link
                to={`/maintenances/${id}/edit`}
                className="px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-md"
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

      {/* Maintenance Information */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Maintenance Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Maintenance Number
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {maintenance.maintenanceNumber}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {new Date(maintenance.date).toLocaleString()}
              </p>
            </div>
          </div>{" "}
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {maintenance.type}
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
                {maintenance.linkedTruck?.matricule || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Information */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Cost Information
          </h2>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl border border-green-200 dark:border-green-800">
          <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Cost
          </p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400">
            ${maintenance.cost?.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Description */}
      {maintenance.description && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Description
            </h2>
          </div>
          <p className="text-base text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            {maintenance.description}
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
              {new Date(maintenance.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Updated
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {new Date(maintenance.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceView;
