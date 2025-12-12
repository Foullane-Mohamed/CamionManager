import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { maintenanceService } from "../../services/maintenance.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const MaintenanceList = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { showSuccess, showError } = useApp();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchMaintenances();
  }, []);
  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getAll();

      let maintenancesArray = [];
      if (Array.isArray(data)) {
        maintenancesArray = data;
      } else if (data && Array.isArray(data.maintenances)) {
        maintenancesArray = data.maintenances;
      } else if (data && Array.isArray(data.data)) {
        maintenancesArray = data.data;
      }

      setMaintenances(maintenancesArray);
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to fetch maintenance records"
      );
      setMaintenances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, maintenanceNumber) => {
    if (
      !window.confirm(
        `Are you sure you want to delete maintenance record ${maintenanceNumber}?`
      )
    ) {
      return;
    }

    try {
      await maintenanceService.delete(id);
      showSuccess("Maintenance record deleted successfully");
      fetchMaintenances();
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to delete maintenance record"
      );
    }
  };

  const filteredMaintenances = Array.isArray(maintenances)
    ? maintenances.filter((maintenance) => {
        const matchesSearch =
          maintenance.maintenanceNumber
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          maintenance.serviceProvider
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          maintenance.description?.toLowerCase().includes(search.toLowerCase());

        const matchesType = typeFilter
          ? maintenance.maintenanceType === typeFilter
          : true;

        const matchesStatus = statusFilter
          ? maintenance.status === statusFilter
          : true;

        return matchesSearch && matchesType && matchesStatus;
      })
    : [];

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
        <p className="text-gray-500">Loading maintenance records...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Maintenance Records</h1>
        {userRole === "admin" && (
          <Link
            to="/maintenances/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Add Maintenance
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search by number, provider, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Oil Change">Oil Change</option>
              <option value="Tire Replacement">Tire Replacement</option>
              <option value="Vehicle Revision">Vehicle Revision</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaintenances.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No maintenance records found
                  </td>
                </tr>
              ) : (
                filteredMaintenances.map((maintenance) => (
                  <tr key={maintenance._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {maintenance.maintenanceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {maintenance.maintenanceType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {maintenance.linkedVehicle?.matricule || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(
                          maintenance.maintenanceDate
                        ).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${maintenance.cost?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          maintenance.status
                        )}`}
                      >
                        {maintenance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/maintenances/${maintenance._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        {userRole === "admin" && (
                          <>
                            <Link
                              to={`/maintenances/${maintenance._id}/edit`}
                              className="text-green-600 hover:text-green-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(
                                  maintenance._id,
                                  maintenance.maintenanceNumber
                                )
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredMaintenances.length} of {maintenances.length}{" "}
        maintenance records
      </div>
    </div>
  );
};

export default MaintenanceList;
