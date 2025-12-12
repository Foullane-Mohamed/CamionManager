import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { userRole } = useAuth();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Fleet Manager</span>
            <span>© {currentYear}</span>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                userRole === "admin"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {userRole === "admin" ? "Admin" : "Chauffeur"}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="hover:text-blue-600 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Documentation
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Support
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>System Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
