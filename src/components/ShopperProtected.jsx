import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext";

/**
 * Guard component that blocks Admins from accessing Shopper-only pages.
 * If user is an Admin, they are redirected to the /admin center.
 */
const ShopperProtected = ({ children }) => {
  const { user, loadingCart } = useContext(shopContext);

  if (loadingCart) return null; // Wait for profile fetch if necessary

  // If user is an Admin, redirect them to the Admin Center
  if (user && user.is_staff) {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise (Shopper or Guest), allow access
  return children;
};

export default ShopperProtected;
