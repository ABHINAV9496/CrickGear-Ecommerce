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
    <div className="bg-black min-h-screen text-white px-6 sm:px-16 py-16">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-10">
        ADMIN <span className="text-red-600">PANEL</span>
      </h1>

      {/* TAB BUTTONS */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 py-2 border rounded capitalize transition ${
              tab === t.key
                ? "bg-red-600 border-red-600"
                : "border-gray-600 hover:bg-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="mt-10">
        {tab === "dashboard" && <AdminDashboard />}
        {tab === "products" && <AdminProducts />}
        {tab === "users" && <AdminUsers />}
        {tab === "orders" && <AdminOrders />}
      </div>
    </div>
  );
};

export default Admin;
