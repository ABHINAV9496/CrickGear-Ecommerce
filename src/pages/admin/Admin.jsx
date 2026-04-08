import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import AdminOrders from "./AdminOrders";

const Admin = () => {
  const [tab, setTab] = useState("dashboard");

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "users", label: "Users" },
    { key: "orders", label: "Orders" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto pt-12 pb-24 text-white px-4 sm:px-10 animate-fade-in-up">

      <div className="mb-10 text-center border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold tracking-wider">
          CONTROL <span className="text-red-600">CENTER</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2">Manage products, orders, and system analytics</p>
      </div>

      <div className="flex justify-center gap-2 sm:gap-8 mb-12 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-2 sm:px-6 py-2.5 text-sm uppercase tracking-widest font-bold border-b-2 transition-all ${
              tab === t.key
                ? "border-red-600 text-white text-shadow-red"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-6xl mx-auto">
        {tab === "dashboard" && <AdminDashboard />}
        {tab === "products" && <AdminProducts />}
        {tab === "users" && <AdminUsers />}
        {tab === "orders" && <AdminOrders />}
      </div>
    </div>
  );
};

export default Admin;
