import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { maintenanceService } from "../../services/maintenance.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  Wrench,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  Clock,
  Calendar as CalendarIcon,
  XCircle,
  Loader2,
  Filter,
  DollarSign,
  Truck,
} from "lucide-react";

const MaintenanceList = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { showSuccess, showError } = useApp();
  const { userRole } = useAuth();

  const fetchMaintenances = useCallback(async () => {
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
  }, [showError]);

  useEffect(() => {
    fetchMaintenances();
  }, [fetchMaintenances]);

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

  const getStatusBadge = (status) => {
    const styles = {
      Completed: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300",
        icon: CheckCircle,
      },
      "In Progress": {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-300",
        icon: Clock,
      },
      Scheduled: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-300",
        icon: CalendarIcon,
      },
      Cancelled: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-300",
        icon: XCircle,
      },
    };

    const config = styles[status] || {
      bg: "bg-gray-100 dark:bg-gray-900/30",
      text: "text-gray-800 dark:text-gray-300",
      icon: Clock,
    };
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        <IconComponent className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 dark:text-orange-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-amber-600 dark:from-orange-500 dark:to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Maintenance Records
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage all maintenance operations
            </p>
          </div>
        </div>
        {userRole === "admin" && (
          <Link
            to="/maintenances/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 dark:bg-orange-500 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Maintenance
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by number, provider, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 text-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="Preventive">Preventive</option>
              <option value="Corrective">Corrective</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredMaintenances.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">No maintenance records found</p>
                  </td>
                </tr>
              ) : (
                filteredMaintenances.map((maintenance) => (
                  <tr
                    key={maintenance._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {maintenance.maintenanceNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                        <Truck className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {maintenance.linkedVehicle?.matricule || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {maintenance.maintenanceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(
                          maintenance.maintenanceDate
                        ).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                        {maintenance.cost?.toFixed(2) || "0.00"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(maintenance.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/maintenances/${maintenance._id}/view`}
                          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        {userRole === "admin" && (
                          <>
                            <Link
                              to={`/maintenances/${maintenance._id}/edit`}
                              className="inline-flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(
                                  maintenance._id,
                                  maintenance.maintenanceNumber
                                )
                              }
                              className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
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
    </div>
  );
};

export default MaintenanceList;
