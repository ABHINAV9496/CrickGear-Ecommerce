import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";
import { statusBadge } from "../../utils/orderStatus";

const API = "/orders/admin";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");


  const loadOrders = async () => {
    try {
      const res = await api.get(`${API}/all/`);
      setOrders(res.data);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders
    .filter((o) =>
      filterStatus === "All" ? true : o.status === filterStatus
    )
    .filter((o) =>
      `${o.id}${o.user_name || ''}${o.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold tracking-wider uppercase">Order Intelligence</h2>
      </div>

      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <input
            placeholder="Search active manifests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors placeholder:text-gray-600 text-white"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#0a0a0a] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-gray-300 min-w-[180px] cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option>Placed</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((o) => (
          <div
            key={o.id}
            className="bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 p-5 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors group"
          >
            <div>
              <p className="font-bold text-gray-200 text-lg">
                Order #{o.id}
              </p>
              <p className="text-gray-500 text-sm mt-1">Operative: <span className="text-gray-300">{o.user_name || o.shipping_full_name}</span></p>

              <span
                className={`inline-block mt-3 px-3 py-1 text-xs border rounded-full font-bold uppercase tracking-wider ${statusBadge[o.status]}`}
              >
                {o.status}
              </span>
            </div>

            <button
              onClick={() => navigate(`/admin/orders/${o.id}`)}
              className="bg-[#111] border border-gray-700 hover:border-red-600 hover:text-red-500 text-gray-300 px-6 py-2 rounded text-xs font-semibold uppercase tracking-widest transition-colors"
            >
              Inspect
            </button>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="text-center py-20 bg-[#0a0a0a] border border-gray-800 rounded-lg">
            <p className="text-gray-500">No matching orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
