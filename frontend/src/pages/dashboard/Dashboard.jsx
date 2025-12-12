import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, userRole } = useAuth();

  const cards = [
    {
      name: "Trucks",
      href: "/trucks",
      icon: "🚛",
      color: "bg-blue-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Trailers",
      href: "/trailers",
      icon: "🚚",
      color: "bg-green-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Trips",
      href: "/trips",
      icon: "📍",
      color: "bg-yellow-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Fuel Records",
      href: "/fuels",
      icon: "⛽",
      color: "bg-red-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Maintenance",
      href: "/maintenances",
      icon: "🔧",
      color: "bg-purple-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Tires",
      href: "/tires",
      icon: "⚙️",
      color: "bg-indigo-500",
      roles: ["admin", "chauffeur"],
    },
    {
      name: "Users",
      href: "/users",
      icon: "👥",
      color: "bg-pink-500",
      roles: ["admin"],
    },
  ];

  const filteredCards = cards.filter((card) => card.roles.includes(userRole));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCards.map((card) => (
          <Link
            key={card.name}
            to={card.href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div
              className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
            >
              <span className="text-2xl">{card.icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{card.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage {card.name.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
