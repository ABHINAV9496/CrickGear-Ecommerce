import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="bg-black text-white min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl font-extrabold text-red-600 mb-4">404</p>
      <p className="text-2xl font-bold mb-2">Page not found</p>
      <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
