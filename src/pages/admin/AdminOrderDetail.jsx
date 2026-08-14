import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";
import getProductImage from "../../utils/getProductImage";
import { statusBadge, steps } from "../../utils/orderStatus";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await api.get("/orders/admin/all/");
        const found = res.data.find((o) => o.id === Number(id));
        if (!found) setNotFound(true);
        else setOrder(found);
      } catch {
        toast.error("Failed to load order");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      await api.patch(`/orders/admin/${order.id}/status/`, { status: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const cancelOrder = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="text-red-500 font-semibold mb-3">
            Cancel this order?
          </p>
          <div className="flex gap-3">
            <button
              className="bg-red-600 px-4 py-1 rounded text-white"
              onClick={async () => {
                try {
                  await api.patch(`/orders/admin/${order.id}/status/`, { status: "Cancelled" });
                  setOrder((prev) => ({ ...prev, status: "Cancelled" }));
                  toast.success("Order cancelled");
                } catch {
                  toast.error("Failed to cancel order");
                }
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

  const deleteOrder = () => {
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
                  await api.delete(`/orders/admin/${order.id}/delete/`);
                  toast.success("Order deleted");
                  navigate("/admin/orders");
                } catch {
                  toast.error("Failed to delete order");
                }
                closeToast();
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

  if (loading) {
    return (
      <div className="animate-fade-in-up text-center py-20">
        <p className="text-gray-500 animate-pulse">Loading manifest...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="animate-fade-in-up text-center py-20 bg-[#0a0a0a] border border-gray-800 rounded-lg">
        <p className="text-gray-500 mb-6">Order not found.</p>
        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-[#111] border border-gray-700 hover:border-red-600 hover:text-red-500 text-gray-300 px-6 py-2 rounded text-xs font-semibold uppercase tracking-widest transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up max-w-3xl mx-auto bg-[#0a0a0a] border border-red-900/50 p-8 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.1)]">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-wider uppercase text-red-500">Logistics Manifest</h2>
          <p className="text-gray-500 text-sm mt-1">ID: <span className="text-gray-300 font-medium">{order.id}</span></p>
        </div>
        <button
          onClick={() => navigate("/admin/orders")}
          className="text-gray-500 hover:text-red-500 transition-colors duration-300 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
        >
          Back to Orders
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-3">Operative Details</p>
          <p className="text-xl font-bold text-white uppercase tracking-wide">{order.user_name || order.shipping_full_name}</p>

          <div className="mt-4 text-sm text-gray-400 space-y-1 bg-[#111] border border-gray-800/50 p-4 rounded-md">
            <p className="text-gray-200 font-semibold mb-2">{order.shipping_full_name} <span className="text-gray-500 font-normal">({order.shipping_phone})</span></p>
            <p>{order.shipping_street}</p>
            <p>{order.shipping_city}, {order.shipping_state}</p>
            <p className="text-red-500/80 font-bold tracking-wider">PIN: {order.shipping_pincode}</p>
          </div>
        </div>

        <div>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-3">Mission Status</p>
          <span className={`inline-block px-4 py-1.5 text-sm border rounded-full font-bold uppercase tracking-wider ${statusBadge[order.status]}`}>
            {order.status}
          </span>

          <select
            disabled={order.status === "Delivered"}
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
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
            width: order.status === "Cancelled" ? "0%" : `${(steps.indexOf(order.status) / (steps.length - 1)) * 100}%`,
            opacity: order.status === "Cancelled" ? 0 : 1
          }}
        ></div>

        {steps.map((step) => (
          <div key={step} className="flex flex-col items-center flex-1 relative z-10">
            <div
              className={`w-6 h-6 rounded-full border-4 transition-all duration-700 ${steps.indexOf(step) <= steps.indexOf(order.status) && order.status !== "Cancelled"
                  ? "bg-red-600 border-[#111] shadow-[0_0_15px_rgba(220,38,38,0.8)] scale-110"
                  : "bg-[#0a0a0a] border-gray-700"
                }`}
            />
            <p className={`text-[10px] sm:text-xs mt-4 uppercase tracking-wider text-center ${steps.indexOf(step) <= steps.indexOf(order.status) && order.status !== "Cancelled" ? "text-red-500 font-bold" : "text-gray-600 font-semibold"}`}>{step}</p>
          </div>
        ))}
      </div>

      <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-4">Secured Payload</p>
      <div className="space-y-4 mb-8 bg-[#111] p-6 rounded-lg border border-gray-800">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-6 border-b border-gray-800/50 pb-4 last:border-0 last:pb-0">
            <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-gray-800">
              <img src={getProductImage(item.image)} className="w-full h-full object-cover" alt="" />
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
          ₹{order.total}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
        <button
          onClick={cancelOrder}
          className="border border-gray-600 text-gray-300 hover:text-white hover:border-white px-8 py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors text-white"
        >
          Cancel Order
        </button>

        <button
          onClick={deleteOrder}
          className="border border-red-800 text-red-500 hover:bg-red-600 hover:text-white px-8 py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors shadow-lg hover:shadow-red-600/20 text-white"
        >
          Delete Order
        </button>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
