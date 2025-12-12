import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { truckService } from "../../services/truck.service";
import { useApp } from "../../context/AppContext";

const TruckView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useApp();
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTruck();
  }, [id]);

  const fetchTruck = async () => {
    try {
      const data = await truckService.getOne(id);
      setTruck(data);
    } catch (error) {
      showError("Failed to fetch truck details");
      navigate("/trucks");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Disponible: "bg-green-100 text-green-800",
      "En Mission": "bg-blue-100 text-blue-800",
      "En Maintenance": "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-3 py-1 text-sm font-semibold rounded-full ${
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
        <div className="text-gray-500">Loading truck details...</div>
      </div>
    );
  }

  if (!truck) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Truck not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Truck Details</h1>
        <Link
          to="/trucks"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back to List
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {truck.matricule}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Matricule
              </label>
              <p className="text-lg text-gray-900">{truck.matricule}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Status
              </label>
              <div>{getStatusBadge(truck.status)}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Brand
              </label>
              <p className="text-lg text-gray-900">{truck.brand}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Model
              </label>
              <p className="text-lg text-gray-900">{truck.model}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Year of Manufacture
              </label>
              <p className="text-lg text-gray-900">{truck.yearOfManufacture}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Fuel Type
              </label>
              <p className="text-lg text-gray-900">{truck.fuelType}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Current Mileage
              </label>
              <p className="text-lg text-gray-900">
                {truck.currentMileage?.toLocaleString()} km
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Created At
              </label>
              <p className="text-lg text-gray-900">
                {new Date(truck.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Last Updated
              </label>
              <p className="text-lg text-gray-900">
                {new Date(truck.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <Link
            to={`/trucks/${truck._id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Truck
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TruckView;
