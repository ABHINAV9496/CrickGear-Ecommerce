import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products", end: false },
  { to: "/admin/users", label: "Users", end: false },
  { to: "/admin/orders", label: "Orders", end: false },
];

const Admin = () => {
  return (
    <div className="w-full max-w-7xl mx-auto pt-12 pb-24 text-white px-4 sm:px-10 animate-fade-in-up">

      <div className="mb-10 text-center border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold tracking-wider">
          Admin <span className="text-red-600">Dashboard</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2">Manage products, orders, users and analytics</p>
      </div>

      <div className="flex justify-center gap-2 sm:gap-8 mb-12 flex-wrap">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `px-2 sm:px-6 py-2.5 text-sm uppercase tracking-widest font-bold border-b-2 transition-all ${
                isActive
                  ? "border-red-600 text-white text-shadow-red"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
