// AdminRoute.jsx (Auth + Admin)
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid, isUserAdmin } from "../../utils/jwt-helper";

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTokenValid() || !isUserAdmin()) {
      navigate("/v1/login");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AdminRoute;
