import { type ReactNode } from "react";
import { useAuthStore } from "../store/auth-store";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    const userRole = (user?.role || "").trim().toUpperCase();
    const hasRole = allowedRoles.some(
      (role) => role.trim().toUpperCase() === userRole,
    );

    if (!hasRole) {
      return (
        <Navigate
          to="/unauthorized"
          state={{
            from: location,
            requiredRoles: allowedRoles,
            currentRole: user?.role,
          }}
          replace
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;
