import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { trailerService } from "../../services/trailer.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  Container,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  Activity,
  Wrench,
  Loader2,
  Filter,
} from "lucide-react";

const TrailerList = () => {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { showSuccess, showError } = useApp();
  const { userRole } = useAuth();

  const fetchTrailers = useCallback(async () => {
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
  }, [showError]);

  useEffect(() => {
    fetchTrailers();
  }, [fetchTrailers]);

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
      Disponible: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300",
        icon: CheckCircle,
      },
      "En Mission": {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-300",
        icon: Activity,
      },
      "En Maintenance": {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-300",
        icon: Wrench,
      },
    };

    const config = styles[status] || styles["Disponible"];
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
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Container className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trailers
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage all trailer records
            </p>
          </div>
        </div>
        {userRole === "admin" && (
          <Link
            to="/trailers/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 dark:bg-emerald-500 text-white rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Trailer
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by matricule or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="Frigorifique">Frigorifique</option>
              <option value="Bâché">Bâché</option>
              <option value="Citerne">Citerne</option>
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
                  Matricule
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Capacity
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
              {filteredTrailers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <Container className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">No trailers found</p>
                  </td>
                </tr>
              ) : (
                filteredTrailers.map((trailer) => (
                  <tr
                    key={trailer._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {trailer.matricule}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {trailer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {trailer.capacity} kg
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(trailer.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/trailers/${trailer._id}/view`}
                          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        {userRole === "admin" && (
                          <>
                            <Link
                              to={`/trailers/${trailer._id}/edit`}
                              className="inline-flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(trailer._id, trailer.matricule)
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

export default TrailerList;
