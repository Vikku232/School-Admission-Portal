import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'teacher' | 'student')[];
}

/**
 * Route guard component to protect dashboard routes.
 * Checks if the user is authenticated and has the correct role.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Redirect to home/login if not authenticated
  if (!isAuthenticated) {
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    // Optionally pass the attempted URL in state for post-login redirect
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If roles are specified, check if the user's role is allowed
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they try to access another role's portal
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // Render the child routes
  return <Outlet />;
};
