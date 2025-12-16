import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      if (response?.accountStatus === "pending") {
        toast.info("Your account is pending approval by admin.");
        return { accountStatus: "pending", message: response.message };
      }
      const token = response.token || response.accessToken;
      const userData = response.user || { ...response };

      if (userData.token) delete userData.token;
      if (userData.accessToken) delete userData.accessToken;
      if (userData.refreshToken) delete userData.refreshToken;

      if (!token) {
        toast.error("Login failed: No authentication token received");
        throw new Error("No token received");
      }

      setToken(token);
      setUser(userData);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Login successful!");
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
      throw error;
    }
  };
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response?.accountStatus === "pending") {
        toast.info(
          "Registration successful! Your account is pending approval."
        );
        return { accountStatus: "pending", message: response.message };
      }

      const token = response.token || response.accessToken;
      const userInfo = response.user || { ...response };
      if (userInfo.token) delete userInfo.token;
      if (userInfo.accessToken) delete userInfo.accessToken;
      if (userInfo.refreshToken) delete userInfo.refreshToken;

      setToken(token);
      setUser(userInfo);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      toast.success("Registration successful!");
      return { success: true, user: userInfo };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      throw error;
    }
  };  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.info("Logged out successfully");
    }
  };
  const refreshUser = async () => {
    try {      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
    } catch {
      return;
    }
  };

  const isAuthenticated = !!token && !!user;
  const userRole = user?.role || null;

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated,
    userRole,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
