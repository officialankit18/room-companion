import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Spinner } from "../components/ui";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading your workspace" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

