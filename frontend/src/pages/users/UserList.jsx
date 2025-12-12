import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userService } from "../../services/user.service";
import { useApp } from "../../context/AppContext";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const { showSuccess, showError } = useApp();

  useEffect(() => {
    fetchUsers();
    fetchPendingUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();

      let usersArray = [];
      if (Array.isArray(data)) {
        usersArray = data;
      } else if (data && Array.isArray(data.users)) {
        usersArray = data.users;
      } else if (data && Array.isArray(data.data)) {
        usersArray = data.data;
      }

      setUsers(usersArray);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const data = await userService.getPending();

      // Handle different response structures
      let usersArray = [];
      if (Array.isArray(data)) {
        usersArray = data;
      } else if (data && Array.isArray(data.users)) {
        usersArray = data.users;
      } else if (data && Array.isArray(data.data)) {
        usersArray = data.data;
      }

      setPendingUsers(usersArray);
    } catch (error) {
      console.error("Failed to fetch pending users");
      setPendingUsers([]);
    }
  };

  const handleApprove = async (id, name) => {
    if (!window.confirm(`Approve user ${name}?`)) return;
    try {
      await userService.approve(id, "approved");
      showSuccess("User approved successfully");
      fetchUsers();
      fetchPendingUsers();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to approve user");
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Reject user ${name}?`)) return;
    try {
      await userService.approve(id, "rejected");
      showSuccess("User rejected");
      fetchUsers();
      fetchPendingUsers();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to reject user");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user ${name}? This action cannot be undone.`))
      return;
    try {
      await userService.delete(id);
      showSuccess("User deleted successfully");
      fetchUsers();
      fetchPendingUsers();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete user");
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
        className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
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
        className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[role]}`}
      >
        {role}
      </span>
    );
  };

  const displayUsers = tab === "pending" ? pendingUsers : users;

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">
          Manage users and approve chauffeur accounts
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setTab("all")}
              className={`px-6 py-3 text-sm font-medium ${
                tab === "all"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setTab("pending")}
              className={`px-6 py-3 text-sm font-medium ${
                tab === "pending"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending Approval ({pendingUsers.length})
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                displayUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.accountStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phoneNumber || "-"}
                    </td>{" "}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        {" "}
                        <Link
                          to={`/users/${user._id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          View
                        </Link>
                        {user.accountStatus === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(user._id, user.name)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleReject(user._id, user.name)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          Delete
                        </button>
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

export default UserList;
