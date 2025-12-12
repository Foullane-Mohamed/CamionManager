import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fuelService } from "../../services/fuel.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

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
        <p className="text-gray-500">Loading fuel records...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fuel Records</h1>
        {userRole === "admin" && (
          <Link
            to="/fuels/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Fuel Record
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="Search by station, driver, vehicle, or notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fuel Records Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Station
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity (L)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/L
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFuels.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No fuel records found
                  </td>
                </tr>
              ) : (
                filteredFuels.map((fuel) => (
                  <tr key={fuel._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(fuel.dateOfOperation).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {fuel.linkedVehicle?.matricule || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {fuel.linkedDriver?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {fuel.fuelStationLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {fuel.quantity?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${fuel.pricePerLitre?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${fuel.totalCost?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <Link
                          to={`/fuels/${fuel._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        {userRole === "admin" && (
                          <>
                            <Link
                              to={`/fuels/${fuel._id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(fuel._id)}
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
    </div>
  );
};

export default FuelList;
