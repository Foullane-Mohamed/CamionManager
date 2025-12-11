import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ChauffeurLayout from '../layouts/ChauffeurLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../components/AdminDashboard';
import ChauffeurDashboard from '../components/ChauffeurDashboard';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="trucks" element={<div>Admin Trucks</div>} />
                  <Route path="drivers" element={<div>Admin Drivers</div>} />
                  <Route
                    path="maintenance"
                    element={<div>Admin Maintenance</div>}
                  />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chauffeur/*"
          element={
            <ProtectedRoute allowedRoles={['chauffeur']}>
              <ChauffeurLayout>
                <Routes>
                  <Route path="dashboard" element={<ChauffeurDashboard />} />
                  <Route path="trips" element={<div>Chauffeur Trips</div>} />
                  <Route
                    path="profile"
                    element={<div>Chauffeur Profile</div>}
                  />
                </Routes>
              </ChauffeurLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
