import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { truckService } from "../../services/truck.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const TruckList = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { showSuccess, showError } = useApp();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchTrucks();
  }, []);
  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const data = await truckService.getAll();

      let trucksArray = [];
      if (Array.isArray(data)) {
        trucksArray = data;
      } else if (data && Array.isArray(data.trucks)) {
        trucksArray = data.trucks;
      } else if (data && Array.isArray(data.data)) {
        trucksArray = data.data;
      }

      setTrucks(trucksArray);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to fetch trucks");
      setTrucks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, matricule) => {
    if (
      !window.confirm(`Are you sure you want to delete truck ${matricule}?`)
    ) {
      return;
    }

    try {
      await truckService.delete(id);
      showSuccess("Truck deleted successfully");
      fetchTrucks();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete truck");
    }
  };
  const filteredTrucks = Array.isArray(trucks)
    ? trucks.filter((truck) => {
        const matchesSearch =
          truck.matricule.toLowerCase().includes(search.toLowerCase()) ||
          truck.brand.toLowerCase().includes(search.toLowerCase()) ||
          truck.model.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "" || truck.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  const getStatusBadge = (status) => {
    const styles = {
      Disponible: "bg-green-100 text-green-800",
      "En Mission": "bg-blue-100 text-blue-800",
      "En Maintenance": "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading trucks...</div>
      </div>
    );
  }

  return (
    <div>
      {" "}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Trucks</h1>
        {userRole === "admin" && (
          <Link
            to="/trucks/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Add Truck
          </Link>
        )}
      </div>{" "}
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by matricule, brand, or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="Disponible">Disponible</option>
              <option value="En Mission">En Mission</option>
              <option value="En Maintenance">En Maintenance</option>
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
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand / Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mileage (km)
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
              {filteredTrucks.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No trucks found
                  </td>
                </tr>
              ) : (
                filteredTrucks.map((truck) => (
                  <tr key={truck._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {truck.matricule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {truck.brand} {truck.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {truck.yearOfManufacture}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {truck.fuelType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {truck.currentMileage?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(truck.status)}
                    </td>{" "}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/trucks/${truck._id}/view`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          View
                        </Link>
                        {userRole === "admin" && (
                          <>
                            <Link
                              to={`/trucks/${truck._id}/edit`}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(truck._id, truck.matricule)
                              }
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
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

export default TruckList;
