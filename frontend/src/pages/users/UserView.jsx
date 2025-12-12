import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userService } from "../../services/user.service";
import { useApp } from "../../context/AppContext";

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useApp();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const data = await userService.getOne(id);
      setUser(data);
    } catch (error) {
      showError("Failed to fetch user details");
      navigate("/users");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-purple-100 text-purple-800",
      chauffeur: "bg-blue-100 text-blue-800",
    };
    return (
      <span
        className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[role]}`}
      >
        {role}
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  if (!user)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User not found</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
        <Link
          to="/users"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to List
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Name
              </label>
              <p className="text-lg text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Role
              </label>
              <div>{getRoleBadge(user.role)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Account Status
              </label>
              <div>{getStatusBadge(user.accountStatus)}</div>
            </div>
            {user.role === "chauffeur" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <p className="text-lg text-gray-900">
                    {user.phoneNumber || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    National ID
                  </label>
                  <p className="text-lg text-gray-900">
                    {user.nationalId || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    License Number
                  </label>
                  <p className="text-lg text-gray-900">
                    {user.licenseNumber || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    License Type
                  </label>
                  <p className="text-lg text-gray-900">
                    {user.licenseType || "-"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Address
                  </label>
                  <p className="text-lg text-gray-900">{user.address || "-"}</p>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Created At
              </label>
              <p className="text-lg text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Last Updated
              </label>
              <p className="text-lg text-gray-900">
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
