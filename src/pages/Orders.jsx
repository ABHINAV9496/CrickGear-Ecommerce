import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

const Orders = () => {
  const { user, currency } = useContext(shopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.get("/orders/my/")
      .then((res) => setOrders(res.data))
      .catch((e) => {
        const msg = e.response?.data?.detail || "Failed to load orders ❌";
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);


  const cancelOrder = (orderId) => {
    toast(({ closeToast }) => (
      <div>
        <p className="mb-3 font-semibold text-red-500">Cancel this order?</p>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              try {

                const res = await api.post(`/orders/${orderId}/cancel/`);
                setOrders(orders.map((o) => o.id === orderId ? res.data : o));
                toast.success("Order cancelled & stock restored 🔄");
              } catch (e) {
                const msg = e.response?.data?.detail || "Failed to cancel order ❌";
                toast.error(msg);
              }
              closeToast();
            }}
            className="bg-red-600 px-4 py-1 text-sm rounded"
          >YES</button>
          <button onClick={closeToast} className="bg-gray-600 px-4 py-1 text-sm rounded">NO</button>
        </div>
      </div>
    ), { autoClose: false });
  };

  const getImageSrc = (image) => {
    if (!image) return "";
    if (image.startsWith("http") || image.startsWith("/")) return image;
    return assets[image];
  };

  if (!user) return null;
  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Loading orders...</p>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto pt-16 pb-24 px-6 sm:px-10 animate-fade-in-up text-white">

      <div className="mb-12 text-center border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold tracking-wider">
          YOUR <span className="text-red-600">ORDERS</span>
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-400">You haven't placed any orders yet.</p>
          <button onClick={() => navigate("/collection")} className="mt-6 bg-red-600 hover:bg-red-500 text-white py-2 px-8 rounded transition-colors text-sm">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">


              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800/60">
                <div>
                  <h2 className="text-lg font-bold text-gray-200">Order #{order.id}</h2>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleString()} • {order.payment_method}
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                  <p className="text-xl font-bold text-red-500">{currency}{order.total}</p>
                  <p className={`text-xs font-semibold px-3 py-1 rounded uppercase tracking-wider ${order.status === "Cancelled"
                      ? "bg-red-500/10 text-red-500"
                      : order.status === "Delivered"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                    {order.status}
                  </p>
                </div>
              </div>


              <div className="flex flex-col gap-4 mb-6">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#111] p-3 rounded">
                    <div className="w-16 h-16 shrink-0 bg-white flex items-center justify-center rounded overflow-hidden">
                      <img
                        src={getImageSrc(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <div className="flex gap-4 text-xs text-gray-400 mt-1">
                        {item.size && <p>Size: <span className="text-white">{item.size}</span></p>}
                        <p>Qty: <span className="text-white">{item.quantity}</span></p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">{currency}{item.price}</p>
                  </div>
                ))}
              </div>


              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-gray-800/60">
                {order.shippingAddress && (
                  <div className="text-xs text-gray-400">
                    <p className="font-semibold text-gray-300 mb-1">Shipping To:</p>
                    <p>{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
                    <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                  </div>
                )}
                <div>
                  {order.status !== "Cancelled" && order.status !== "Delivered" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-xs font-medium border border-gray-600 text-gray-300 hover:text-white hover:border-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;