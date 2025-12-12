import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PendingApproval = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
      

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Account Pending Approval
          </h2>
      
      

          <div className="mt-8 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Return to Login
            </button>

      
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
