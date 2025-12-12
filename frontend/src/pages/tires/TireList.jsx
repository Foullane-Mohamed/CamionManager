import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tireService } from "../../services/tire.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  CircleDot,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  Filter,
  Truck,
} from "lucide-react";

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

  const getStatusBadge = (status) => {
    const styles = {
      Bon: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300",
        icon: CheckCircle,
      },
      "À remplacer": {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-300",
        icon: AlertTriangle,
      },
      Usé: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-300",
        icon: XCircle,
      },
    };

    const config = styles[status] || {
      bg: "bg-gray-100 dark:bg-gray-900/30",
      text: "text-gray-800 dark:text-gray-300",
      icon: CircleDot,
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

  // Get unique brands for filter
  const uniqueBrands = [...new Set(tires.map((tire) => tire.brand))].filter(
    Boolean
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-slate-600 dark:from-gray-500 dark:to-slate-500 rounded-2xl flex items-center justify-center shadow-lg">
            <CircleDot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tires
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage all tire inventory
            </p>
          </div>
        </div>
        {userRole === "admin" && (
          <Link
            to="/tires/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Tire
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by serial, brand, size, or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="Bon">Bon</option>
              <option value="À remplacer">À remplacer</option>
              <option value="Usé">Usé</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-gray-900 dark:text-white"
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
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Brand & Size
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Position
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
              {filteredTires.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <CircleDot className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">No tires found</p>
                  </td>
                </tr>
              ) : (
                filteredTires.map((tire) => (
                  <tr
                    key={tire._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {tire.serialNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {tire.brand}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {tire.size}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                        <Truck className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        {tire.linkedVehicle?.matricule || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {tire.vehiclePosition || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tire.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/tires/${tire._id}/view`}
                          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        {userRole === "admin" && (
                          <>
                            <Link
                              to={`/tires/${tire._id}/edit`}
                              className="inline-flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(tire._id, tire.serialNumber)
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

export default TireList;
