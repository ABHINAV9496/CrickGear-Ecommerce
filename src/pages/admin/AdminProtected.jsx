import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { shopContext } from "../../context/ShopContext";

const AdminProtected = ({ children }) => {
  const { user, loadingCart } = useContext(shopContext);

  if (loadingCart) return null; // Wait for profile fetch

  if (!user || !user.is_staff) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtected;
