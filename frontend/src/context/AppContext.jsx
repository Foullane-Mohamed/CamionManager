import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const showSuccess = (message) => {
    toast.success(message);
  };

  const showError = (message) => {
    toast.error(message);
  };

  const showWarning = (message) => {
    toast.warning(message);
  };

  const showInfo = (message) => {
    toast.info(message);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const value = {
    globalLoading,
    setGlobalLoading,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
