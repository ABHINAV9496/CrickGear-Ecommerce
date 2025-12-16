import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtected = ({ children }) => {
  const adminAuth = localStorage.getItem("admin_token");

  if (!adminAuth) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminProtected;
