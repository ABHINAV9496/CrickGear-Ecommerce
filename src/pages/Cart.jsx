import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import api from "../api";
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
        await api.patch(`/users/${user.id}`, {
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
    <div className="w-full max-w-6xl mx-auto pt-16 pb-24 px-6 sm:px-10 animate-fade-in-up text-white">
      
      <div className="mb-12 text-center border-b border-gray-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wider">
          YOUR <span className="text-red-600">CART</span>
        </h1>
      </div>

      {!user ? (
        <div className="py-20 text-center">
            <p className="text-gray-400">Please login to view your cart.</p>
            <button onClick={() => navigate("/login")} className="mt-6 bg-red-600 hover:bg-red-500 text-white font-medium text-sm py-2 px-8 transition-colors rounded">Login</button>
        </div>
      ) : cart.length === 0 ? (
        <div className="py-20 text-center">
            <p className="text-gray-400">Your cart is empty.</p>
            <button onClick={() => navigate("/collection")} className="mt-6 border border-gray-600 hover:border-white text-gray-300 hover:text-white font-medium text-sm py-2 px-8 transition-colors rounded">Continue Shopping</button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 bg-[#0a0a0a] border border-gray-800 rounded p-4 relative hover:border-gray-700 transition-colors"
              >
                <div className="w-24 h-24 shrink-0 bg-[#111] rounded overflow-hidden flex items-center justify-center">
                   <img src={assets[item.image]} alt={item.name} className="w-full h-full object-cover" />
                </div>
  
                <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                  <div>
                    <h3 className="text-lg font-medium text-gray-200">{item.name}</h3>
                    {item.size && <p className="text-xs text-gray-400 mt-1">Size: <span className="text-white">{item.size}</span></p>}
                    <p className="text-sm font-semibold text-gray-300 mt-1">{currency}{item.price}</p>
                  </div>
                </div>
  
                <div className="flex items-center gap-6 sm:gap-4 mt-2 sm:mt-0">
                  <div className="flex items-center border border-gray-700/60 bg-[#111] rounded overflow-hidden">
                    <button onClick={() => decreaseQty(item.id, item.size)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 transition text-sm text-gray-300 hover:text-white">-</button>
                    <p className="w-8 text-center text-sm font-medium">{item.quantity}</p>
                    <button onClick={() => increaseQty(item.id, item.size, item.stock)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 transition text-sm text-gray-300 hover:text-white">+</button>
                  </div>
  
                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-gray-500 hover:text-red-500 transition-colors bg-[#111] p-2 rounded border border-gray-800"
                    title="Remove Item"
                  >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-80 h-fit bg-[#0a0a0a] border border-gray-800 rounded p-6">
            <h2 className="text-lg font-bold border-b border-gray-800 pb-3 mb-4">Order Summary</h2>
            
            <div className="flex justify-between items-center text-gray-300 text-sm mb-3">
               <p>Items ({cart.reduce((total, item) => total + item.quantity, 0)})</p>
               <p>{currency}{totalPrice}</p>
            </div>
            <div className="flex justify-between items-center text-gray-300 text-sm mb-4">
               <p>Shipping Cost</p>
               <p className="text-gray-500 text-xs">Calculated later</p>
            </div>
            
            <div className="flex justify-between items-center text-lg font-bold border-t border-gray-800 pt-4 mb-6">
               <p>Total</p>
               <p className="text-red-600">{currency}{totalPrice}</p>
            </div>

             <button
                onClick={proceedToPayment}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold text-sm py-3 px-6 transition-colors rounded shadow-lg shadow-red-600/10 uppercase tracking-widest"
              >
                Proceed to Checkout
              </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
