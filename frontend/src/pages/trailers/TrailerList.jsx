import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { trailerService } from "../../services/trailer.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const TrailerList = () => {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { showSuccess, showError } = useApp();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchTrailers();
  }, []);
  const fetchTrailers = async () => {
    try {
      setLoading(true);
      const data = await trailerService.getAll();

      let trailersArray = [];
      if (Array.isArray(data)) {
        trailersArray = data;
      } else if (data && Array.isArray(data.trailers)) {
        trailersArray = data.trailers;
      } else if (data && Array.isArray(data.data)) {
        trailersArray = data.data;
      }

      setTrailers(trailersArray);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to fetch trailers");
      setTrailers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, matricule) => {
    if (
      !window.confirm(`Are you sure you want to delete trailer ${matricule}?`)
    ) {
      return;
    }

    try {
      await trailerService.delete(id);
      showSuccess("Trailer deleted successfully");
      fetchTrailers();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete trailer");
    }
  };
  const filteredTrailers = Array.isArray(trailers)
    ? trailers.filter((trailer) => {
        const matchesSearch =
          trailer.matricule.toLowerCase().includes(search.toLowerCase()) ||
          trailer.type.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === "" || trailer.type === typeFilter;
        return matchesSearch && matchesType;
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
        className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading trailers...</div>
      </div>
    );
  }

  return (
    <div>
      {" "}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Trailers</h1>
        {userRole === "admin" && (
          <Link
            to="/trailers/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Trailer
          </Link>
        )}
      </div>{" "}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by matricule or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Frigo">Frigo</option>
              <option value="Plateau">Plateau</option>
              <option value="Fourgon">Fourgon</option>
              <option value="Citerne">Citerne</option>
              <option value="Benne">Benne</option>
              <option value="Porte-conteneur">Porte-conteneur</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Max Load (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mileage (km)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrailers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No trailers found
                  </td>
                </tr>
              ) : (
                filteredTrailers.map((trailer) => (
                  <tr key={trailer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {trailer.matricule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trailer.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trailer.maximumLoad?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trailer.currentMileage?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(trailer.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        {" "}
                        <Link
                          to={`/trailers/${trailer._id}/view`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          View
                        </Link>
                        {userRole === "admin" && (
                          <>
                            <Link
                              to={`/trailers/${trailer._id}/edit`}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(trailer._id, trailer.matricule)
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

export default TrailerList;
