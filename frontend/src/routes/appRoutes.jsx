import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PendingApproval from "../pages/auth/PendingApproval";

// Dashboard
import Dashboard from "../pages/dashboard/Dashboard";

// Truck pages
import TruckList from "../pages/trucks/TruckList";
import TruckCreate from "../pages/trucks/TruckCreate";
import TruckEdit from "../pages/trucks/TruckEdit";
import TruckView from "../pages/trucks/TruckView";

// Trailer pages
import TrailerList from "../pages/trailers/TrailerList";
import TrailerCreate from "../pages/trailers/TrailerCreate";
import TrailerEdit from "../pages/trailers/TrailerEdit";
import TrailerView from "../pages/trailers/TrailerView";

// Trip pages
import TripList from "../pages/trips/TripList";
import TripCreate from "../pages/trips/TripCreate";
import TripEdit from "../pages/trips/TripEdit";
import TripView from "../pages/trips/TripView";

// Fuel pages
import FuelList from "../pages/fuels/FuelList";
import FuelCreate from "../pages/fuels/FuelCreate";
// import FuelEdit from "../pages/fuels/FuelEdit";
import FuelView from "../pages/fuels/FuelView";

// Maintenance pages
import MaintenanceList from "../pages/maintenances/MaintenanceList";
import MaintenanceCreate from "../pages/maintenances/MaintenanceCreate";
import MaintenanceEdit from "../pages/maintenances/MaintenanceEdit";
import MaintenanceView from "../pages/maintenances/MaintenanceView";

// Tire pages
import TireList from "../pages/tires/TireList";
import TireCreate from "../pages/tires/TireCreate";
import TireEdit from "../pages/tires/TireEdit";
import TireView from "../pages/tires/TireView";

// User pages
import UserList from "../pages/users/UserList";
import UserView from "../pages/users/UserView";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      {" "}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pending-approval" element={<PendingApproval />} />{" "}
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* Trucks */}
          <Route path="trucks" element={<TruckList />} />
          <Route
            path="trucks/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TruckCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="trucks/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TruckEdit />
              </ProtectedRoute>
            }
          />
          <Route path="trucks/:id/view" element={<TruckView />} />
          {/* Trailers */}
          <Route path="trailers" element={<TrailerList />} />
          <Route
            path="trailers/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TrailerCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="trailers/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TrailerEdit />
              </ProtectedRoute>
            }
          />
          <Route path="trailers/:id/view" element={<TrailerView />} />
          {/* Trips */}
          <Route path="trips" element={<TripList />} />
          <Route
            path="trips/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TripCreate />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="trips/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TripEdit />
              </ProtectedRoute>
            }
          />
          <Route path="trips/:id" element={<TripView />} />
          {/* Fuels */}
          <Route path="fuels" element={<FuelList />} />
          <Route
            path="fuels/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <FuelCreate />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="fuels/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <FuelEdit />
              </ProtectedRoute>
            }
          /> */}
          <Route path="fuels/:id" element={<FuelView />} />
          {/* Maintenances */}
          <Route path="maintenances" element={<MaintenanceList />} />
          <Route
            path="maintenances/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MaintenanceCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="maintenances/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MaintenanceEdit />
              </ProtectedRoute>
            }
          />
          <Route path="maintenances/:id/view" element={<MaintenanceView />} />{" "}
          {/* Tires */}
          <Route path="tires" element={<TireList />} />
          <Route
            path="tires/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TireCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="tires/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TireEdit />
              </ProtectedRoute>
            }
          />
          <Route path="tires/:id" element={<TireView />} />
          {/* Users */}
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserList />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="users/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserView />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
