import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { userRole, user } = useAuth();

  const adminNavigation = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Trucks", path: "/trucks" },
    { name: "Trailers", path: "/trailers" },
    { name: "Trips", path: "/trips" },
    { name: "Fuel Records", path: "/fuels" },
    { name: "Maintenance", path: "/maintenances" },
    { name: "Tires", path: "/tires" },
    { name: "Users Management", path: "/users" },
  ];

  const chauffeurNavigation = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Trips", path: "/trips" },
    { name: "Trucks", path: "/trucks" },
    { name: "Trailers", path: "/trailers" },
    { name: "Fuel Records", path: "/fuels" },
    { name: "Maintenance", path: "/maintenances" },
    { name: "Tires", path: "/tires" },
  ];

  const navigation =
    userRole === "admin" ? adminNavigation : chauffeurNavigation;
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
          <p className="text-sm font-semibold text-gray-900 capitalize mt-1">
            {userRole === "admin" ? "Administrator" : "Chauffeur"}
          </p>
        </div>

        <nav className="h-full overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                  }`
                }
              >
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {userRole === "admin" && (
            <div className="px-4 py-4 mt-6 mx-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-semibold text-blue-900 mb-1">
                Admin Panel
              </p>
              <p className="text-xs text-blue-700">
                Full system access and user management
              </p>
            </div>
          )}

          {userRole === "chauffeur" && (
            <div className="px-4 py-4 mt-6 mx-3 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs font-semibold text-green-900 mb-1">
                Chauffeur Portal
              </p>
              <p className="text-xs text-green-700">
                Manage your trips and vehicle records
              </p>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
