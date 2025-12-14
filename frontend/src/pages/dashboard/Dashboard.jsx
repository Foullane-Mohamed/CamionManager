import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Truck,
  Container,
  Route,
  Droplet,
  Wrench,
  CircleDot,
  Users,
  LayoutDashboard,
} from "lucide-react";

const Dashboard = () => {
  const { userRole } = useAuth();
  const cards = [
    {
      name: "Trucks",
      href: "/trucks",
      icon: Truck,
      color: "from-blue-500 to-cyan-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Trailers",
      href: "/trailers",
      icon: Container,
      color: "from-emerald-500 to-teal-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Trips",
      href: "/trips",
      icon: Route,
      color: "from-purple-500 to-indigo-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Fuel Records",
      href: "/fuels",
      icon: Droplet,
      color: "from-blue-500 to-indigo-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Maintenance",
      href: "/maintenances",
      icon: Wrench,
      color: "from-orange-500 to-amber-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Tires",
      href: "/tires",
      icon: CircleDot,
      color: "from-gray-500 to-slate-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      color: "from-pink-500 to-rose-500",
      roles: ["admin"],
    },
  ];

  const filteredCards = cards.filter((card) => card.roles.includes(userRole));
  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
          <LayoutDashboard className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Link
              key={card.name}
              to={card.href}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-6 border border-gray-200 dark:border-gray-800 group hover:border-blue-500 dark:hover:border-blue-400"
            >
              <div
                className={`bg-gradient-to-br ${card.color} dark:${card.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}
              >
                <IconComponent className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {card.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage {card.name.toLowerCase()}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
