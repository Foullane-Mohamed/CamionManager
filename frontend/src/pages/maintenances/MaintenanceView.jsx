import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { maintenanceService } from "../../services/maintenance.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const MaintenanceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useApp();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchMaintenance();
  }, [id]);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getOne(id);
      setMaintenance(data);
    } catch (error) {
      showError("Failed to fetch maintenance details");
      navigate("/maintenances");
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading maintenance details...</p>
      </div>
    );
  }

  if (!maintenance) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Maintenance record not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Maintenance Details</h1>
        <div className="flex gap-3">
          <Link
            to="/maintenances"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to List
          </Link>
          {userRole === "admin" && (
            <>
              <Link
                to={`/maintenances/${id}/edit`}
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

      {/* Maintenance Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Maintenance Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Maintenance Number</p>
            <p className="text-lg font-medium">
              {maintenance.maintenanceNumber}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="text-lg font-medium">{maintenance.maintenanceType}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                maintenance.status
              )}`}
            >
              {maintenance.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Maintenance Date</p>
            <p className="text-lg font-medium">
              {new Date(maintenance.maintenanceDate).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="text-lg font-medium">
              {maintenance.linkedVehicle?.matricule || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Vehicle Mileage</p>
            <p className="text-lg font-medium">
              {maintenance.vehicleMileageAtMaintenance?.toLocaleString()} km
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Cost</p>
            <p className="text-lg font-medium text-green-600">
              ${maintenance.cost?.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Service Provider</p>
            <p className="text-lg font-medium">{maintenance.serviceProvider}</p>
          </div>

          {maintenance.nextMaintenanceDueDate && (
            <div>
              <p className="text-sm text-gray-500">Next Maintenance Due Date</p>
              <p className="text-lg font-medium">
                {new Date(
                  maintenance.nextMaintenanceDueDate
                ).toLocaleDateString()}
              </p>
            </div>
          )}

          {maintenance.nextMaintenanceDueMileage && (
            <div>
              <p className="text-sm text-gray-500">
                Next Maintenance Due Mileage
              </p>
              <p className="text-lg font-medium">
                {maintenance.nextMaintenanceDueMileage?.toLocaleString()} km
              </p>
            </div>
          )}

          {maintenance.isAlertTriggered && (
            <div>
              <p className="text-sm text-gray-500">Alert Type</p>
              <p className="text-lg font-medium">{maintenance.alertType}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">Performed By</p>
            <p className="text-lg font-medium">
              {maintenance.performedBy?.name || "N/A"}
            </p>
          </div>
        </div>

        {maintenance.description && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-base bg-gray-50 p-4 rounded-md">
              {maintenance.description}
            </p>
          </div>
        )}

        {maintenance.remarks && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Remarks</p>
            <p className="text-base bg-gray-50 p-4 rounded-md">
              {maintenance.remarks}
            </p>
          </div>
        )}
      </div>

      {/* Parts Replaced */}
      {maintenance.partsReplaced && maintenance.partsReplaced.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Parts Replaced</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Part Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {maintenance.partsReplaced.map((part, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {part.partName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {part.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${part.unitPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(part.quantity * part.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Record Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-base">
              {new Date(maintenance.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-base">
              {new Date(maintenance.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceView;
