import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { tireService } from "../../services/tire.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  CircleDot,
  ArrowLeft,
  Pencil,
  Trash2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Truck,
  Calendar,
  Loader2,
  Package,
} from "lucide-react";

const TireView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tire, setTire] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useApp();
  const { userRole } = useAuth();

  const fetchTire = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tireService.getOne(id);
      setTire(data);
    } catch {
      showError("Failed to fetch tire details");
      navigate("/tires");
    } finally {
      setLoading(false);
    }
  }, [id, showError, navigate]);

  useEffect(() => {
    fetchTire();
  }, [fetchTire]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete tire ${tire.serialNumber}?`
      )
    ) {
      return;
    }

    try {
      await tireService.delete(id);
      showSuccess("Tire deleted successfully");
      navigate("/tires");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete tire");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Bon: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300",
        icon: CheckCircle,
      },
      "À remplacer": {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-300",
        icon: AlertTriangle,
      },
      Usé: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-300",
        icon: XCircle,
      },
    };

    const config = styles[status] || styles["Bon"];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        <IconComponent className="w-4 h-4" />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  if (!tire) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <CircleDot className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Tire not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-slate-600 dark:from-gray-500 dark:to-slate-500 rounded-2xl flex items-center justify-center shadow-lg">
            <CircleDot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tire Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Serial: {tire.serialNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to="/tires"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          {userRole === "admin" && (
            <>
              <Link
                to={`/tires/${id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Status Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status
          </h2>
          <div className="flex items-center gap-3">
            {getStatusBadge(tire.status)}
          </div>
        </div>

        {/* Tire Information */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Tire Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CircleDot className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Serial Number
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {tire.serialNumber}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Package className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Brand
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {tire.brand}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Package className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Size</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {tire.size}
                </p>
              </div>
            </div>

            {tire.vehiclePosition && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Package className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Position
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {tire.vehiclePosition}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Information */}
        {tire.linkedVehicle && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Linked Vehicle
            </h2>
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vehicle Matricule
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {tire.linkedVehicle.matricule}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Installation Date */}
        {tire.installationDate && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Installation Date
            </h2>
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Installed On
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {new Date(tire.installationDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TireView;
