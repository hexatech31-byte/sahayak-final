import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Gate for every /vendor/* route.
// Validates active Firebase session and role.
export const VendorProtectedRoute = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> Redirect to Landing/Login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in as Officer trying to access Vendor route -> Redirect to Officer Dashboard
  if (role === 'officer') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default VendorProtectedRoute;
