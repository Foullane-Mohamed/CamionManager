import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tripService } from "../../services/trip.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showSuccess, showError } = useApp();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchTrips();
  }, []);
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getAll();

      let tripsArray = [];
      if (Array.isArray(data)) {
        tripsArray = data;
      } else if (data && Array.isArray(data.trips)) {
        tripsArray = data.trips;
      } else if (data && Array.isArray(data.data)) {
        tripsArray = data.data;
      }

      setTrips(tripsArray);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to fetch trips");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, tripNumber) => {
    if (!window.confirm(`Delete trip ${tripNumber}?`)) return;
    try {
      await tripService.delete(id);
      showSuccess("Trip deleted successfully");
      fetchTrips();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete trip");
    }
  };
  const filteredTrips = Array.isArray(trips)
    ? trips.filter(
        (trip) =>
          trip.tripNumber?.toLowerCase().includes(search.toLowerCase()) ||
          trip.startPoint?.toLowerCase().includes(search.toLowerCase()) ||
          trip.destinationPoint?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const getStatusBadge = (status) => {
    const styles = {
      "À faire": "bg-yellow-100 text-yellow-800",
      "En cours": "bg-blue-100 text-blue-800",
      Terminé: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
        {userRole === "admin" && (
          <Link
            to="/trips/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Trip
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <input
          type="text"
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trip Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Departure
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
              {filteredTrips.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No trips found
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => (
                  <tr key={trip._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {trip.tripNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {trip.startPoint} → {trip.destinationPoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(trip.departureDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(trip.status)}
                    </td>{" "}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/trips/${trip._id}/view`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        {userRole === "admin" && (
                          <>
                            <Link
                              to={`/trips/${trip._id}/edit`}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(trip._id, trip.tripNumber)
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

export default TripList;
