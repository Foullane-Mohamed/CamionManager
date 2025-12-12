import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fuelService } from "../../services/fuel.service";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const FuelView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fuel, setFuel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useApp();
  const { userRole } = useAuth();

  useEffect(() => {
    fetchFuel();
  }, [id]);

  const fetchFuel = async () => {
    try {
      setLoading(true);
      const data = await fuelService.getOne(id);
      setFuel(data);
    } catch (error) {
      showError("Failed to fetch fuel record details");
      navigate("/fuels");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this fuel record?")) {
      return;
    }

    try {
      await fuelService.delete(id);
      showSuccess("Fuel record deleted successfully");
      navigate("/fuels");
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to delete fuel record"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading fuel record details...</p>
      </div>
    );
  }

  if (!fuel) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Fuel record not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fuel Record Details</h1>
        <div className="flex gap-3">
          <Link
            to="/fuels"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to List
          </Link>
          {userRole === "admin" && (
            <>
              <Link
                to={`/fuels/${id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Fuel Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Fuel Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Date of Operation</p>
            <p className="text-lg font-medium">
              {new Date(fuel.dateOfOperation).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Fuel Station Location</p>
            <p className="text-lg font-medium">{fuel.fuelStationLocation}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="text-lg font-medium">
              {fuel.linkedVehicle?.matricule || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Driver</p>
            <p className="text-lg font-medium">
              {fuel.linkedDriver?.name || "N/A"}
            </p>
          </div>

          {fuel.linkedTrip && (
            <div>
              <p className="text-sm text-gray-500">Related Trip</p>
              <p className="text-lg font-medium">
                {fuel.linkedTrip?.tripNumber || fuel.linkedTrip}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fuel Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Fuel Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Quantity</p>
            <p className="text-2xl font-bold text-blue-600">
              {fuel.quantity?.toFixed(2)} L
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Price per Litre</p>
            <p className="text-2xl font-bold text-indigo-600">
              ${fuel.pricePerLitre?.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Cost</p>
            <p className="text-2xl font-bold text-green-600">
              ${fuel.totalCost?.toFixed(2)}
            </p>
          </div>
        </div>

        {fuel.notes && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Notes</p>
            <p className="text-base bg-gray-50 p-4 rounded-md">{fuel.notes}</p>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Record Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-base">
              {new Date(fuel.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-base">
              {new Date(fuel.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelView;
