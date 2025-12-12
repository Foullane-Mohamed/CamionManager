import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fuelService } from "../../services/fuel.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  Droplet,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  User,
  Truck,
  Calendar,
  DollarSign,
} from "lucide-react";

const FuelList = () => {
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showSuccess, showError } = useApp();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchFuels();
  }, []);
  const fetchFuels = async () => {
    try {
      setLoading(true);
      const data = await fuelService.getAll();

      let fuelsArray = [];
      if (Array.isArray(data)) {
        fuelsArray = data;
      } else if (data && Array.isArray(data.fuels)) {
        fuelsArray = data.fuels;
      } else if (data && Array.isArray(data.data)) {
        fuelsArray = data.data;
      }

      setFuels(fuelsArray);
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to fetch fuel records"
      );
      setFuels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fuel record?")) {
      return;
    }

    try {
      await fuelService.delete(id);
      showSuccess("Fuel record deleted successfully");
      fetchFuels();
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to delete fuel record"
      );
    }
  };

  const filteredFuels = Array.isArray(fuels)
    ? fuels.filter((fuel) => {
        const searchLower = search.toLowerCase();
        return (
          fuel.fuelStationLocation?.toLowerCase().includes(searchLower) ||
          fuel.linkedDriver?.name?.toLowerCase().includes(searchLower) ||
          fuel.linkedVehicle?.matricule?.toLowerCase().includes(searchLower) ||
          fuel.notes?.toLowerCase().includes(searchLower)
        );
      })
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }
  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Droplet className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Fuel Records
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage all fuel transactions
            </p>
          </div>
        </div>
        {userRole === "admin" && (
          <Link
            to="/fuels/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Fuel Record
          </Link>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by station, driver, vehicle, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Station
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quantity (L)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price/L
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredFuels.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <Droplet className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">No fuel records found</p>
                  </td>
                </tr>
              ) : (
                filteredFuels.map((fuel) => (
                  <tr
                    key={fuel._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {new Date(fuel.dateOfOperation).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                        <Truck className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {fuel.linkedVehicle?.matricule || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        {fuel.linkedDriver?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white max-w-xs">
                        <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        <span className="truncate">
                          {fuel.fuelStationLocation}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {fuel.quantity?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                        <DollarSign className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {fuel.pricePerLitre?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                        <DollarSign className="w-4 h-4" />
                        {fuel.totalCost?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/fuels/${fuel._id}`}
                          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        {userRole === "admin" && (
                          <>
                            <Link
                              to={`/fuels/${fuel._id}/edit`}
                              className="inline-flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(fuel._id)}
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

export default FuelList;
