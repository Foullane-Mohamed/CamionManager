import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Truck,
  Container,
  Route,
  Droplet,
  Wrench,
  CircleDot,
  Users,
  LayoutDashboard,
  Download,
  Clock,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Gauge,
  FileText,
  Eye,
  Loader2,
  Edit,
} from "lucide-react";
import { tripService } from "../../services/trip.service";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(null);

  // Load driver's assigned trips if chauffeur role
  useEffect(() => {
    if (userRole === "chauffeur") {
      loadMyTrips();
    }
  }, [userRole]);

  const loadMyTrips = async () => {
    try {
      setLoading(true);
      const response = await tripService.getAll();
      const allTrips = Array.isArray(response)
        ? response
        : response?.trips || response?.data || [];

      // Filter trips assigned to this driver
      const myTrips = allTrips.filter(
        (trip) =>
          trip.assignedDriver?._id === user?._id ||
          trip.assignedDriver === user?._id
      );

      setTrips(myTrips);
    } catch (error) {
      console.error("Error loading trips:", error);
      toast.error("Failed to load your trips");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (tripId, newStatus) => {
    try {
      setUpdating(tripId);
      await tripService.updateStatus(tripId, { status: newStatus });
      toast.success(`Trip status updated to ${newStatus}`);
      loadMyTrips(); // Reload trips
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update trip status"
      );
    } finally {
      setUpdating(null);
    }
  };
  const handleDownloadPDF = async (tripId) => {
    try {
      setDownloadingPDF(tripId);
      console.log("Downloading PDF for trip:", tripId);

      const pdfBlob = await tripService.generatePDF(tripId);

      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error("Received empty PDF file");
      }

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mission-order-${tripId}.pdf`;
      link.setAttribute("download", `mission-order-${tripId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("Mission order downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);

      // More specific error messages
      if (error.response?.status === 404) {
        toast.error(
          "PDF generation endpoint not found. Please contact administrator."
        );
      } else if (error.response?.status === 500) {
        toast.error(
          "Server error while generating PDF. Please try again later."
        );
      } else if (error.message === "Received empty PDF file") {
        toast.error("Generated PDF is empty. Please check trip data.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to download PDF. The feature may not be available yet."
        );
      }
    } finally {
      setDownloadingPDF(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "À faire":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "En cours":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Terminé":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "À faire":
        return <Clock className="w-4 h-4" />;
      case "En cours":
        return <PlayCircle className="w-4 h-4" />;
      case "Terminé":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Admin Dashboard Cards
  const adminCards = [
    {
      name: "Trucks",
      href: "/trucks",
      icon: Truck,
      color: "from-blue-500 to-cyan-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Trailers",
      href: "/trailers",
      icon: Container,
      color: "from-emerald-500 to-teal-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Trips",
      href: "/trips",
      icon: Route,
      color: "from-purple-500 to-indigo-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Fuel Records",
      href: "/fuels",
      icon: Droplet,
      color: "from-blue-500 to-indigo-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Maintenance",
      href: "/maintenances",
      icon: Wrench,
      color: "from-orange-500 to-amber-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Tires",
      href: "/tires",
      icon: CircleDot,
      color: "from-gray-500 to-slate-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      color: "from-pink-500 to-rose-500",
      roles: ["admin"],
    },
  ];
  const filteredCards = adminCards.filter((card) =>
    card.roles.includes(userRole)
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Chauffeur Dashboard
  if (userRole === "chauffeur") {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Route className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Trips
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
          <button
            onClick={loadMyTrips}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh"
            )}
          </button>
        </div>

        {loading && trips.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 dark:text-purple-400" />
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-12 text-center border border-gray-200 dark:border-gray-800">
            <Route className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Trips Assigned
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have any trips assigned yet. Check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-xl flex items-center justify-center">
                      <Route className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {trip.tripNumber || `Trip #${trip._id?.slice(-6)}`}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            trip.status
                          )}`}
                        >
                          {getStatusIcon(trip.status)}
                          {trip.status}
                        </span>
                      </div>
                    </div>
                  </div>{" "}
                  <button
                    onClick={() => handleDownloadPDF(trip._id)}
                    disabled={downloadingPDF === trip._id}
                    className="px-3 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors inline-flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadingPDF === trip._id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Mission Order
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Start Point
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {trip.startPoint}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Destination
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {trip.destinationPoint}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Departure
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(trip.departureDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Expected Arrival
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(trip.expectedArrivalDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Truck className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Truck
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {trip.assignedTruck?.matricule || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Gauge className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Mileage
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {trip.mileageAtDeparture
                          ? `${trip.mileageAtDeparture} km`
                          : "Not set"}
                        {trip.mileageAtArrival &&
                          ` → ${trip.mileageAtArrival} km`}
                      </p>
                    </div>
                  </div>
                </div>

                {trip.driverRemarks && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Remarks
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {trip.driverRemarks}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => navigate(`/trips/${trip._id}`)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/trips/${trip._id}/edit`)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Update Info
                  </button>

                  {trip.status === "À faire" && (
                    <button
                      onClick={() => handleStatusUpdate(trip._id, "En cours")}
                      disabled={updating === trip._id}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      {updating === trip._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <PlayCircle className="w-4 h-4" />
                      )}
                      Start Trip
                    </button>
                  )}

                  {trip.status === "En cours" && (
                    <button
                      onClick={() => handleStatusUpdate(trip._id, "Terminé")}
                      disabled={updating === trip._id}
                      className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors inline-flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      {updating === trip._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Complete Trip
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
          <LayoutDashboard className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Link
              key={card.name}
              to={card.href}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-6 border border-gray-200 dark:border-gray-800 group hover:border-blue-500 dark:hover:border-blue-400"
            >
              <div
                className={`bg-gradient-to-br ${card.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}
              >
                <IconComponent className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {card.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage {card.name.toLowerCase()}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
