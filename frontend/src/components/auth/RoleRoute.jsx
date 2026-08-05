import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const RoleRoute = ({ roles, children }) => {
  const { user } = useContext(AuthContext);
  const role = user?.details?.role || user?.role;

  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(role)) return <Navigate to="/" replace />;

  return children;
};

export default RoleRoute;
