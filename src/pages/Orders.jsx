import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Orders = () => {
  const { user, currency } = useContext(shopContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/users/${user.id}`)
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch(() => toast.error("Failed to load orders ❌"));
  }, [user, navigate]);

  const cancelOrder = (orderId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="mb-3 font-semibold text-red-500">
            Are you sure you want to cancel this order?
          </p>

          <div className="flex gap-3">
            <button
              onClick={async () => {
                try {
                  const res = await axios.get(
                    `http://localhost:5000/users/${user.id}`
                  );
                  const dbUser = res.data;

                  const orderToCancel = dbUser.orders.find(
                    (o) => o.id === orderId
                  );

                  if (!orderToCancel) {
                    toast.error("Order not found ❌");
                    closeToast();
                    return;
                  }

                  for (const item of orderToCancel.items) {
                    try {
                      const productRes = await axios.get(
                        `http://localhost:5000/products/${item.id}`
                      );
                      const freshStock = productRes.data.stock;

                      await axios.patch(
                        `http://localhost:5000/products/${item.id}`,
                        { stock: freshStock + item.quantity }
                      );
                    } catch {
                      toast.error(`Failed to restore stock for ${item.name}`);
                    }
                  }

                  const updatedOrders = dbUser.orders.map((o) =>
                    o.id === orderId ? { ...o, status: "Cancelled" } : o
                  );

                  await axios.patch(
                    `http://localhost:5000/users/${user.id}`,
                    { orders: updatedOrders }
                  );

                  setOrders(updatedOrders);
                  toast.success("Order cancelled & stock restored 🔄");
                  closeToast();
                } catch {
                  toast.error("Failed to cancel order ❌");
                  closeToast();
                }
              }}
              className="bg-red-600 px-4 py-1 text-sm rounded"
            >
              YES
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-600 px-4 py-1 text-sm rounded"
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
          <p className="mb-3 font-semibold text-red-500">
            This order will be permanently deleted!
          </p>

          <div className="flex gap-3">
            <button
              onClick={async () => {
                try {
                  const res = await axios.get(
                    `http://localhost:5000/users/${user.id}`
                  );
                  const dbUser = res.data;

                  const updatedOrders = dbUser.orders.filter(
                    (o) => o.id !== orderId
                  );

                  await axios.patch(
                    `http://localhost:5000/users/${user.id}`,
                    { orders: updatedOrders }
                  );

                  setOrders(updatedOrders);
                  toast.success("Order deleted 🗑️");
                  closeToast();
                } catch {
                  toast.error("Failed to delete order ❌");
                  closeToast();
                }
              }}
              className="bg-red-600 px-4 py-1 text-sm rounded"
            >
              DELETE
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-600 px-4 py-1 text-sm rounded"
            >
              CANCEL
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  if (!user) return null;

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
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.slice().reverse().map((order) => (
            <div key={order.id} className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800/60">
                 <div>
                    <h2 className="text-lg font-bold text-gray-200">Order #{order.id.toString().slice(-5)}</h2>
                    <p className="text-xs text-gray-400 mt-1">{order.date} • {order.paymentMethod || "COD"}</p>
                 </div>
                 
                 <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                    <p className="text-xl font-bold text-red-500">{currency}{order.total}</p>
                    <p className={`text-xs font-semibold px-3 py-1 rounded uppercase tracking-wider ${order.status === "Cancelled" ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
                       {order.status || "Placed"}
                    </p>
                 </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4 mb-6">
                 {order.items?.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 bg-[#111] p-3 rounded">
                       <div className="w-16 h-16 shrink-0 bg-black flex items-center justify-center rounded overflow-hidden">
                          <img src={assets[item.image]} alt={item.name} className="w-full h-full object-cover" />
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

              {/* Order Footer & Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-4 border-t border-gray-800/60">
                 
                 {order.shippingAddress ? (
                    <div className="text-xs text-gray-400">
                       <p className="font-semibold text-gray-300 mb-1">Shipping To:</p>
                       <p>{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
                       <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                    </div>
                 ) : <div />}

                 <div className="flex flex-wrap items-center gap-3">
                    {order.status !== "Cancelled" && (
                       <button onClick={() => cancelOrder(order.id)} className="text-xs font-medium border border-gray-600 text-gray-300 hover:text-white hover:border-white px-4 py-2 rounded transition-colors">
                          Cancel
                       </button>
                    )}
                    <button onClick={() => deleteOrder(order.id)} className="text-xs font-medium border border-red-800 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 rounded transition-colors">
                       Delete
                    </button>
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
