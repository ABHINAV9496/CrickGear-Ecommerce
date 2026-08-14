import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { shopContext } from "../context/shopContext";

/**
 * Guard component that blocks Admins from accessing Shopper-only pages.
 * If user is an Admin, they are redirected to the /admin center.
 */
const ShopperProtected = ({ children }) => {
  const { user, loadingCart } = useContext(shopContext);

  if (loadingCart) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 animate-pulse uppercase tracking-widest font-bold">Loading...</p>
      </div>
    );
  }

  // If user is an Admin, redirect them to the Admin Center
  if (user && user.is_staff) {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise (Shopper or Guest), allow access
  return children;
};

export default ShopperProtected;
