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
                  // Fetch fresh user
                  const res = await axios.get(
                    `http://localhost:5000/users/${user.id}`
                  );
                  const dbUser = res.data;

                  // Find this order
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
    <div className="bg-black text-white min-h-screen px-6 sm:px-20 py-16">
      <h1 className="text-3xl font-bold text-center mb-10">
        YOUR <span className="text-red-600">ORDERS</span>
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order.id}
                className="bg-[#111] border border-gray-700 rounded p-6"
              >
               
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <div>
                    <p className="font-semibold">
                      Order #{order.id.toString().slice(-5)}
                    </p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>

                  <div className="text-sm space-y-1">
                    <p>
                      Total:{" "}
                      <span className="text-red-500 font-semibold">
                        {currency}
                        {order.total}
                      </span>
                    </p>

                    <p className="text-gray-400">
                      Payment: {order.paymentMethod || "COD"}
                    </p>

                    <p
                      className={`font-semibold ${
                        order.status === "Cancelled"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      Status: {order.status || "Placed"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4 mb-4 space-y-3 text-sm">
                  {order.items?.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex items-center gap-4 border-b border-gray-800 pb-3"
                    >
                      <img
                        src={assets[item.image]}
                        alt={item.name}
                        className="w-16"
                      />

                      <div className="flex-1">
                        <p className="font-semibold">
                          {item.name}
                          {item.size && (
                            <span className="text-xs text-gray-400 ml-2">
                              (Size: {item.size})
                            </span>
                          )}
                        </p>

                        <p className="text-gray-400">
                          Qty: {item.quantity} × {currency}
                          {item.price}
                        </p>
                      </div>

                      <p className="font-semibold">
                        {currency}
                        {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

               
                {order.shippingAddress && (
                  <div className="border-t border-gray-800 pt-4 mb-4 text-sm text-gray-300">
                    <p className="font-semibold mb-2 text-red-500">
                      Shipping Address
                    </p>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.phone}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} -{" "}
                      {order.shippingAddress.pincode}
                    </p>
                  </div>
                )}

                
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  {order.status !== "Cancelled" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="border border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition px-5 py-2 text-sm"
                    >
                      Cancel Order
                    </button>
                  )}

                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition px-5 py-2 text-sm"
                  >
                    Delete Order
                  </button>
                </div>

                {order.status === "Cancelled" && (
                  <p className="text-right text-xs text-red-500 mt-2">
                    This order has been cancelled
                  </p>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
