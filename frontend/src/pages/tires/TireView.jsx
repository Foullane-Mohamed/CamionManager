import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { tireService } from "../../services/tire.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const TireView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tire, setTire] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useApp();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchTire();
  }, [id]);

  const fetchTire = async () => {
    try {
      setLoading(true);
      const data = await tireService.getOne(id);
      setTire(data);
    } catch (error) {
      showError("Failed to fetch tire details");
      navigate("/tires");
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Bon":
        return "bg-green-100 text-green-800";
      case "À remplacer":
        return "bg-yellow-100 text-yellow-800";
      case "Usé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading tire details...</p>
      </div>
    );
  }

  if (!tire) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Tire not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tire Details</h1>
        <div className="flex gap-3">
          <Link
            to="/tires"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to List
          </Link>
          {userRole === "admin" && (
            <>
              <Link
                to={`/tires/${id}/edit`}
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

      {/* Tire Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tire Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Serial Number</p>
            <p className="text-lg font-medium">{tire.serialNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                tire.status
              )}`}
            >
              {tire.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Brand</p>
            <p className="text-lg font-medium">{tire.brand}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Size</p>
            <p className="text-lg font-medium">{tire.size}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Installation Date</p>
            <p className="text-lg font-medium">
              {new Date(tire.installationDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Vehicle Position</p>
            <p className="text-lg font-medium">{tire.vehiclePosition}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Associated Vehicle Type</p>
            <p className="text-lg font-medium">{tire.associatedVehicleType}</p>
          </div>{" "}
          <div>
            <p className="text-sm text-gray-500">Associated Vehicle ID</p>
            <p className="text-sm font-medium font-mono">
              {tire.associatedVehicleId}
            </p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Record Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-base">
              {new Date(tire.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-base">
              {new Date(tire.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TireView;
