import React, { useEffect, useState } from "react";
import api from "../../api";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const API = "/orders/admin";

const statusBadge = {
  Placed: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
  Processing: "bg-orange-500/20 text-orange-400 border-orange-500",
  Shipped: "bg-blue-500/20 text-blue-400 border-blue-500",
  "Out for Delivery": "bg-purple-500/20 text-purple-400 border-purple-500",
  Delivered: "bg-green-500/20 text-green-400 border-green-500",
  Cancelled: "bg-red-500/20 text-red-500 border-red-500",
};

const steps = ["Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`${API}/${orderId}/status/`, { status: newStatus });
      toast.success("Order status updated");
      loadOrders();
      setSelectedOrder(null);
    } catch {
      toast.error("Failed to update status");
    }
  };


  const cancelOrder = (orderId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-red-500 font-semibold mb-3">
            Cancel this order?
          </p>
          <div className="flex gap-3">
            <button
              className="bg-red-600 px-4 py-1 rounded text-white"
              onClick={() => {
                updateStatus(orderId, "Cancelled");
                closeToast();
              }}
            >
              YES
            </button>
            <button
              className="bg-gray-700 px-4 py-1 rounded text-white"
              onClick={closeToast}
            >
              NO
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };


  const deleteOrder = (orderId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-red-500 font-semibold mb-3">
            Delete this order permanently?
          </p>
          <div className="flex gap-3">
            <button
              className="bg-red-600 px-4 py-1 rounded text-white"
              onClick={async () => {
                try {
                  await api.delete(`${API}/${orderId}/delete/`);
                  toast.success("Order deleted");
                  loadOrders();
                  setSelectedOrder(null);
                  closeToast();
                } catch {
                  toast.error("Failed to delete order");
                  closeToast();
                }
              }}
            >
              DELETE
            </button>
            <button
              className="bg-gray-700 px-4 py-1 rounded text-white"
              onClick={closeToast}
            >
              CANCEL
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };


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
              onClick={() => setSelectedOrder(o)}
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

      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm p-4 sm:p-8">
          <div className="relative mx-auto mt-10 mb-20 bg-[#0a0a0a] border border-red-900/50 p-8 rounded-xl w-full max-w-3xl shadow-[0_0_30px_rgba(220,38,38,0.1)] animate-fade-in-up">

            <div className="flex justify-between items-start border-b border-gray-800 pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-wider uppercase text-red-500">Logistics Manifest</h2>
                <p className="text-gray-500 text-sm mt-1">ID: <span className="text-gray-300 font-medium">{selectedOrder.id}</span></p>
              </div>
              <button onClick={() => { setSelectedOrder(null); }} className="text-gray-500 hover:text-red-500 hover:rotate-90 transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-3">Operative Details</p>
                <p className="text-xl font-bold text-white uppercase tracking-wide">{selectedOrder.user_name || selectedOrder.shipping_full_name}</p>

                <div className="mt-4 text-sm text-gray-400 space-y-1 bg-[#111] border border-gray-800/50 p-4 rounded-md">
                  <p className="text-gray-200 font-semibold mb-2">{selectedOrder.shipping_full_name} <span className="text-gray-500 font-normal">({selectedOrder.shipping_phone})</span></p>
                  <p>{selectedOrder.shipping_street}</p>
                  <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_state}</p>
                  <p className="text-red-500/80 font-bold tracking-wider">PIN: {selectedOrder.shipping_pincode}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-3">Mission Status</p>
                <span className={`inline-block px-4 py-1.5 text-sm border rounded-full font-bold uppercase tracking-wider ${statusBadge[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>

                <select
                  disabled={selectedOrder.status === "Delivered"}
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  className="w-full bg-[#111] border border-gray-800 p-4 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white mt-6 cursor-pointer disabled:opacity-50 font-semibold tracking-wide"
                >
                  <option>Placed</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mb-10 bg-[#111] p-8 rounded-lg border border-gray-800 relative">
              <div className="absolute left-[12%] right-[12%] top-1/2 -translate-y-1/2 h-0.5 bg-gray-800 z-0 hidden sm:block"></div>
              <div
                className="absolute left-[12%] right-[12%] top-1/2 -translate-y-1/2 h-0.5 bg-red-600 z-0 hidden sm:block transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                style={{
                  width: selectedOrder.status === "Cancelled" ? "0%" : `${(steps.indexOf(selectedOrder.status) / (steps.length - 1)) * 100}%`,
                  opacity: selectedOrder.status === "Cancelled" ? 0 : 1
                }}
              ></div>

              {steps.map((step) => (
                <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                  <div
                    className={`w-6 h-6 rounded-full border-4 transition-all duration-700 ${steps.indexOf(step) <= steps.indexOf(selectedOrder.status) && selectedOrder.status !== "Cancelled"
                        ? "bg-red-600 border-[#111] shadow-[0_0_15px_rgba(220,38,38,0.8)] scale-110"
                        : "bg-[#0a0a0a] border-gray-700"
                      }`}
                  />
                  <p className={`text-[10px] sm:text-xs mt-4 uppercase tracking-wider text-center ${steps.indexOf(step) <= steps.indexOf(selectedOrder.status) && selectedOrder.status !== "Cancelled" ? "text-red-500 font-bold" : "text-gray-600 font-semibold"}`}>{step}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-4">Secured Payload</p>
            <div className="space-y-4 mb-8 bg-[#111] p-6 rounded-lg border border-gray-800">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-6 border-b border-gray-800/50 pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-gray-800">
                    <img src={assets[item.image] || item.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-200 text-lg">{item.name}</p>
                    <p className="text-red-500 font-semibold text-sm mt-1">QTY: {item.quantity}  <span className="text-gray-500 mx-2">|</span>  ₹{item.price}</p>
                  </div>
                  <p className="font-bold text-white text-xl">₹{item.quantity * item.price}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-red-900/40 pt-8 pb-4">
              <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold">Total Invoice Evaluation</p>
              <p className="text-red-500 font-black text-3xl tracking-wider shadow-red-500 text-shadow-red relative">
                ₹{selectedOrder.total}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <button
                onClick={() => cancelOrder(selectedOrder.id)}
                className="border border-gray-600 text-gray-300 hover:text-white hover:border-white px-8 py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors text-white"
              >
                Cancel Order
              </button>

              <button
                onClick={() => deleteOrder(selectedOrder.id)}
                className="border border-red-800 text-red-500 hover:bg-red-600 hover:text-white px-8 py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors shadow-lg hover:shadow-red-600/20 text-white"
              >
                Delete Order
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
