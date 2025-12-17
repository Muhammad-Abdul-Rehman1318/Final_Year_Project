import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) {
    // Redirect to admin login if not marked as admin
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;