import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../../utils/jwt-helper";

const ProtectedRoute = ({ children }) => {
  if (!isTokenValid()) {
    return <Navigate to="/v1/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;