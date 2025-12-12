import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { trailerService } from "../../services/trailer.service";
import { useApp } from "../../context/AppContext";

const TrailerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useApp();
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrailer();
  }, [id]);

  const fetchTrailer = async () => {
    try {
      const data = await trailerService.getOne(id);
      setTrailer(data);
    } catch (error) {
      showError("Failed to fetch trailer details");
      navigate("/trailers");
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
        className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status]}`}
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
  if (!trailer)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Trailer not found</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Trailer Details</h1>
        <Link
          to="/trailers"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to List
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {trailer.matricule}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Matricule
              </label>
              <p className="text-lg text-gray-900">{trailer.matricule}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Status
              </label>
              <div>{getStatusBadge(trailer.status)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Type
              </label>
              <p className="text-lg text-gray-900">{trailer.type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Maximum Load
              </label>
              <p className="text-lg text-gray-900">
                {trailer.maximumLoad?.toLocaleString()} kg
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Current Mileage
              </label>
              <p className="text-lg text-gray-900">
                {trailer.currentMileage?.toLocaleString()} km
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Created At
              </label>
              <p className="text-lg text-gray-900">
                {new Date(trailer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
          <Link
            to={`/trailers/${trailer._id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Trailer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrailerView;
