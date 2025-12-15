import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userService } from "../../services/user.service";
import { useApp } from "../../context/AppContext";
import {
  User,
  ArrowLeft,
  Mail,
  Shield,
  Car,
  Check,
  Clock,
  X,
  Loader2,
  Phone,
  Calendar,
  RefreshCw,
} from "lucide-react";

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useApp();
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

  const handleChangeStatus = async (newStatus) => {
    const statusMessages = {
      approved: "approve",
      pending: "set as pending",
      rejected: "reject",
    };

    if (
      !window.confirm(
        `Are you sure you want to ${statusMessages[newStatus]} this user?`
      )
    )
      return;

    try {
      await userService.approve(id, newStatus);
      showSuccess(`User status updated to ${newStatus}`);
      fetchUser(); // Refresh user data
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300",
        icon: Check,
      },
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-300",
        icon: Clock,
      },
      rejected: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-300",
        icon: X,
      },
    };

    const config = styles[status] || styles["pending"];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        <IconComponent className="w-4 h-4" />
        {status}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
          <Shield className="w-4 h-4" />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
        <Car className="w-4 h-4" />
        Chauffeur
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-pink-600 dark:text-pink-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-rose-600 dark:from-pink-500 dark:to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              User Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.name}
            </p>
          </div>
        </div>
        <Link
          to="/users"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="grid gap-6">
        {" "}
        {/* Status & Role Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status & Role
          </h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {getStatusBadge(user.accountStatus || user.status)}
            {getRoleBadge(user.role)}
          </div>

          {/* Status Management Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Change Account Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.accountStatus !== "approved" &&
                user.status !== "approved" && (
                  <button
                    onClick={() => handleChangeStatus("approved")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    Approve User
                  </button>
                )}

              {user.accountStatus !== "pending" &&
                user.status !== "pending" && (
                  <button
                    onClick={() => handleChangeStatus("pending")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-yellow-600 dark:bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors text-sm font-medium"
                  >
                    <Clock className="w-4 h-4" />
                    Set as Pending
                  </button>
                )}

              {user.accountStatus !== "rejected" &&
                user.status !== "rejected" && (
                  <button
                    onClick={() => handleChangeStatus("rejected")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Reject User
                  </button>
                )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Current status:{" "}
              <span className="font-medium">
                {user.accountStatus || user.status}
              </span>
            </p>
          </div>
        </div>
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            Basic Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <User className="w-5 h-5 text-pink-600 dark:text-pink-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Mail className="w-5 h-5 text-pink-600 dark:text-pink-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Phone className="w-5 h-5 text-pink-600 dark:text-pink-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {user.phone}
                  </p>
                </div>
              </div>
            )}

            {user.createdAt && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="w-5 h-5 text-pink-600 dark:text-pink-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
