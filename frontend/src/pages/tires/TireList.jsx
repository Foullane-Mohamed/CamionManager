import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tireService } from "../../services/tire.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const TireList = () => {
  const [tires, setTires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const { showSuccess, showError } = useApp();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchTires();
  }, []);
  const fetchTires = async () => {
    try {
      setLoading(true);
      const data = await tireService.getAll();

      let tiresArray = [];
      if (Array.isArray(data)) {
        tiresArray = data;
      } else if (data && Array.isArray(data.tires)) {
        tiresArray = data.tires;
      } else if (data && Array.isArray(data.data)) {
        tiresArray = data.data;
      }

      setTires(tiresArray);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to fetch tires");
      setTires([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, serialNumber) => {
    if (
      !window.confirm(`Are you sure you want to delete tire ${serialNumber}?`)
    ) {
      return;
    }

    try {
      await tireService.delete(id);
      showSuccess("Tire deleted successfully");
      fetchTires();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete tire");
    }
  };

  const filteredTires = Array.isArray(tires)
    ? tires.filter((tire) => {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          tire.serialNumber?.toLowerCase().includes(searchLower) ||
          tire.brand?.toLowerCase().includes(searchLower) ||
          tire.size?.toLowerCase().includes(searchLower) ||
          tire.vehiclePosition?.toLowerCase().includes(searchLower);

        const matchesStatus = statusFilter
          ? tire.status === statusFilter
          : true;
        const matchesBrand = brandFilter ? tire.brand === brandFilter : true;

        return matchesSearch && matchesStatus && matchesBrand;
      })
    : [];

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

  // Get unique brands for filter
  const uniqueBrands = [...new Set(tires.map((tire) => tire.brand))].filter(
    Boolean
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading tires...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tire Management</h1>
        {userRole === "admin" && (
          <Link
            to="/tires/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Tire
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by serial, brand, size, or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Bon">Bon</option>
            <option value="À remplacer">À remplacer</option>
            <option value="Usé">Usé</option>
          </select>

          {/* Brand Filter */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            {uniqueBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tires Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Installation Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTires.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No tires found
                  </td>
                </tr>
              ) : (
                filteredTires.map((tire) => (
                  <tr key={tire._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tire.serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tire.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tire.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          tire.status
                        )}`}
                      >
                        {tire.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tire.vehiclePosition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tire.associatedVehicleType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(tire.installationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <Link
                          to={`/tires/${tire._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        {userRole === "admin" && (
                          <>
                            <Link
                              to={`/tires/${tire._id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(tire._id, tire.serialNumber)
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
    </div>
  );
};

export default TireList;
