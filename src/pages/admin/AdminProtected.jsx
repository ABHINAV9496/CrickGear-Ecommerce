import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { shopContext } from "../../context/shopContext";

const AdminProtected = ({ children }) => {
  const { user, loadingCart } = useContext(shopContext);

  if (loadingCart) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 animate-pulse uppercase tracking-widest font-bold">Loading...</p>
      </div>
    );
  }

  if (!user || !user.is_staff) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtected;
