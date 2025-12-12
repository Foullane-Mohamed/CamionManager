import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { trailerService } from "../../services/trailer.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Container,
  Tag,
  Package,
  Activity,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Wrench,
} from "lucide-react";

const TrailerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useApp();
  const { userRole } = useAuth();
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrailer();
  }, [id]);

  const fetchTrailer = async () => {
    try {
      const data = await trailerService.getOne(id);
      setTrailer(data);
    } catch (error) {
      showError("Failed to fetch trailer details");
      navigate("/trailers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete trailer ${trailer.matricule}?`
      )
    ) {
      return;
    }

    try {
      await trailerService.delete(id);
      showSuccess("Trailer deleted successfully");
      navigate("/trailers");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete trailer");
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading trailer details...
          </p>
        </div>
      </div>
    );
  }

  if (!trailer) {
    return (
      <div className="text-center py-12">
        <Container className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Trailer not found</p>
      </div>
    );
  }

  const statusStyle = getStatusStyle(trailer.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
            <Container className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trailer Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {trailer.matricule}
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/trailers"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Link>
          {userRole === "admin" && (
            <>
              <Link
                to={`/trailers/${id}/edit`}
                className="px-4 py-2 bg-emerald-600 dark:bg-emerald-700 text-white rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-md"
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

      {/* Trailer Information */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Trailer Information
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
                {trailer.matricule}
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
                {trailer.status}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {trailer.type}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Capacity
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {trailer.capacity} tons
              </p>
            </div>
          </div>
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
              {new Date(trailer.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Updated
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {new Date(trailer.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerView;
