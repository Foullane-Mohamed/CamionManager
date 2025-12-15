import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Clock, AlertCircle, LogOut, Mail, Shield } from "lucide-react";

const PendingApproval = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="text-center">
          
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                <Clock className="w-10 h-10 text-white" />
              </div>
            </div>{" "}
      
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
              Account Pending
            </h2>
          
            <div className="mb-6">
          
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Your registration has been submitted successfully. An
                administrator needs to approve your account before you can
                access the system.
              </p>
          
            
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
