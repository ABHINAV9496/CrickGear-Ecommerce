import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, setCart, user, currency } = useContext(shopContext);
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (t, i) => t + i.price * i.quantity,
    0
  );

  const updateCart = async (updatedCart) => {
    setCart(updatedCart);

    if (user?.id) {
      try {
        await axios.patch(`http://localhost:5000/users/${user.id}`, {
          cart: updatedCart,
        });
      } catch {
        toast.error("Failed to update cart");
      }
    }
  };

  const increaseQty = (id, size, stock) => {
    const updated = cart.map((item) =>
      item.id === id && item.size === size
        ? { ...item, quantity: item.quantity < stock ? item.quantity + 1 : item.quantity }
        : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id, size) => {
    const updated = cart.map((item) =>
      item.id === id && item.size === size
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    updateCart(updated);
  };

  const removeItem = (id, size) => {
    updateCart(cart.filter((item) => !(item.id === id && item.size === size)));
    toast.success("Item removed");
  };

  const proceedToPayment = () => {
    if (!user) return navigate("/login");
    if (cart.length === 0) return toast.warn("Cart is empty");
    navigate("/payment");
  };

  return (
    <div className="bg-black text-white min-h-screen px-6 sm:px-20 py-16">
      <h1 className="text-3xl font-bold text-center mb-10">
        YOUR <span className="text-red-600">CART</span>
      </h1>

      {!user ? (
        <p className="text-center text-gray-400">Please login to view your cart.</p>
      ) : cart.length === 0 ? (
        <p className="text-center text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="max-w-5xl mx-auto">

          {cart.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-700 py-6"
            >
              <img src={assets[item.image]} alt={item.name} className="w-24" />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {item.name}{" "}
                  {item.size && (
                    <span className="text-sm text-gray-400 ml-2">
                      (Size: {item.size})
                    </span>
                  )}
                </h3>
                <p className="text-gray-400 text-sm">
                  {currency}{item.price} × {item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => decreaseQty(item.id, item.size)} className="px-3 py-1 bg-gray-700">-</button>
                <p>{item.quantity}</p>
                <button
                  onClick={() => increaseQty(item.id, item.size, item.stock)}
                  className="px-3 py-1 bg-gray-700"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id, item.size)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center mt-10">
            <h2 className="text-xl font-semibold">
              Total: <span className="text-red-600">{currency}{totalPrice}</span>
            </h2>

            <button
              onClick={proceedToPayment}
              className="bg-red-600 hover:bg-red-700 px-8 py-3"
            >
              Proceed to Payment
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
