import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const API = "http://localhost:5000/users";

const statusBadge = {
  Placed: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
  Shipped: "bg-blue-500/20 text-blue-400 border-blue-500",
  "Out for Delivery": "bg-purple-500/20 text-purple-400 border-purple-500",
  Delivered: "bg-green-500/20 text-green-400 border-green-500",
  Cancelled: "bg-red-500/20 text-red-500 border-red-500",
};

const steps = ["Placed", "Shipped", "Out for Delivery", "Delivered"];

const AdminOrders = () => {
  const [users, setUsers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (userId, orderId, newStatus) => {
    try {
      const res = await axios.get(`${API}/${userId}`);
      const user = res.data;

      const updatedOrders = user.orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );

      await axios.patch(`${API}/${userId}`, { orders: updatedOrders });

      toast.success("Order status updated");
      loadOrders();
      setSelectedOrder(null);
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ================= CANCEL ORDER ================= */
  const cancelOrder = (userId, orderId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-red-500 font-semibold mb-3">
            Cancel this order?
          </p>
          <div className="flex gap-3">
            <button
              className="bg-red-600 px-4 py-1 rounded"
              onClick={() => {
                updateStatus(userId, orderId, "Cancelled");
                closeToast();
              }}
            >
              YES
            </button>
            <button
              className="bg-gray-700 px-4 py-1 rounded"
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

  /* ================= DELETE ORDER ================= */
  const deleteOrder = (userId, orderId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-red-500 font-semibold mb-3">
            Delete this order permanently?
          </p>
          <div className="flex gap-3">
            <button
              className="bg-red-600 px-4 py-1 rounded"
              onClick={async () => {
                try {
                  const res = await axios.get(`${API}/${userId}`);
                  const user = res.data;

                  const updatedOrders = user.orders.filter(
                    (o) => o.id !== orderId
                  );

                  await axios.patch(`${API}/${userId}`, {
                    orders: updatedOrders,
                  });

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
              className="bg-gray-700 px-4 py-1 rounded"
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

  /* ================= FILTERED ORDERS ================= */
  const filteredOrders = users.flatMap((u) =>
    (u.orders || [])
      .filter((o) =>
        filterStatus === "All" ? true : o.status === filterStatus
      )
      .filter((o) =>
        `${o.id}${u.name}${o.status}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .map((o) => ({ ...o, userId: u.id, userName: u.name }))
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      {/* SEARCH & FILTER */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-black border border-gray-600 px-4 py-2"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-black border border-gray-600 px-4 py-2 cursor-pointer"
        >
          <option value="All">All Status</option>
          <option>Placed</option>
          <option>Shipped</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* ORDER LIST */}
      {filteredOrders.map((o) => (
        <div
          key={o.id}
          className="bg-[#111] border border-gray-700 hover:border-red-600 p-4 mb-4 rounded flex justify-between items-center transition"
        >
          <div>
            <p className="font-semibold">
              Order #{o.id.toString().slice(-5)}
            </p>
            <p className="text-gray-400 text-sm">User: {o.userName}</p>

            <span
              className={`inline-block mt-2 px-3 py-1 text-xs border rounded-full ${statusBadge[o.status]}`}
            >
              {o.status}
            </span>
          </div>

          <button
            onClick={() => setSelectedOrder(o)}
            className="bg-red-600 hover:bg-red-700 px-5 py-1 rounded"
          >
            View
          </button>
        </div>
      ))}

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#111] border border-red-600 p-6 rounded w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-4">Order Details</h2>

            <p>User: <span className="text-white">{selectedOrder.userName}</span></p>
            <p className="text-gray-400">Order ID: {selectedOrder.id}</p>

            <span
              className={`inline-block mt-2 px-3 py-1 text-xs border rounded-full ${statusBadge[selectedOrder.status]}`}
            >
              {selectedOrder.status}
            </span>

            {/* TIMELINE */}
            <div className="flex justify-between mt-6 mb-6">
              {steps.map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      steps.indexOf(step) <= steps.indexOf(selectedOrder.status)
                        ? "bg-red-600"
                        : "bg-gray-600"
                    }`}
                  />
                  <p className="text-xs mt-1">{step}</p>
                </div>
              ))}
            </div>

            {/* ITEMS */}
            {selectedOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 border-b border-gray-800 pb-3 mb-3"
              >
                <img
                  src={assets[item.image] || item.image}
                  className="w-14"
                  alt=""
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-400 text-sm">
                    {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <p className="font-semibold">
                  ₹{item.quantity * item.price}
                </p>
              </div>
            ))}

            <p className="text-red-500 font-semibold mt-2">
              Total: ₹{selectedOrder.total}
            </p>

            {/* ✅ STATUS DROPDOWN (RESTORED) */}
            <select
              disabled={selectedOrder.status === "Delivered"}
              value={selectedOrder.status}
              onChange={(e) =>
                updateStatus(
                  selectedOrder.userId,
                  selectedOrder.id,
                  e.target.value
                )
              }
              className="bg-black border border-gray-600 px-4 py-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              <option>Placed</option>
              <option>Shipped</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>

            {/* ACTIONS */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() =>
                  cancelOrder(selectedOrder.userId, selectedOrder.id)
                }
                className="border border-red-600 text-red-500 px-4 py-1 hover:bg-red-600 hover:text-white transition"
              >
                Cancel Order
              </button>

              <button
                onClick={() =>
                  deleteOrder(selectedOrder.userId, selectedOrder.id)
                }
                className="border border-gray-600 px-4 py-1 hover:bg-gray-700 transition"
              >
                Delete Order
              </button>

              <button
                className="bg-gray-700 px-5 py-2"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
