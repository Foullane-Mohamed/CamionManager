
const Footer = () => {
  const currentYear = new Date().getFullYear();


  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              CamionManager
            </span>
            <span>© {currentYear}</span>
          </div>

          <div className="w-full border-t mt-10 py-6 px-4 flex flex-col md:flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <p className="text-xs">
              © {new Date().getFullYear()} CamionManager. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
