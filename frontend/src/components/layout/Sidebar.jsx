import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Truck,
  Container,
  Route,
  Fuel,
  Wrench,
  CircleDot,
  Users,
  Shield,
  Car,
} from "lucide-react";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { userRole } = useAuth();

  const adminNavigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Trucks", path: "/trucks", icon: Truck },
    { name: "Trailers", path: "/trailers", icon: Container },
    { name: "Trips", path: "/trips", icon: Route },
    { name: "Fuel Records", path: "/fuels", icon: Fuel },
    { name: "Maintenance", path: "/maintenances", icon: Wrench },
    { name: "Tires", path: "/tires", icon: CircleDot },
    { name: "Users Management", path: "/users", icon: Users },
  ];

  const chauffeurNavigation = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Trips", path: "/trips", icon: Route },
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
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            {userRole === "admin" ? (
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Role
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                {userRole === "admin" ? "Administrator" : "Chauffeur"}
              </p>
            </div>
          </div>
        </div>

        <nav className="h-full overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 text-blue-700 dark:text-blue-300 shadow-sm border-l-4 border-blue-600 dark:border-blue-400"
                        : "text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 text-current" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
