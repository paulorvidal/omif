import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/login" />;
    }
  }
  return children;
};
