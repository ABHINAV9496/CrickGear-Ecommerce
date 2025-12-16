import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const empty = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

const Payment = () => {
  const { user, cart, setCart, currency } = useContext(shopContext);
  const navigate = useNavigate();

  const [savedAddress, setSavedAddress] = useState(empty);
  const [editSaved, setEditSaved] = useState(false);

  const [newAddress, setNewAddress] = useState(empty);
  const [editNew, setEditNew] = useState(false);

  const [addressMode, setAddressMode] = useState("saved"); // saved | new
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [upiId, setUpiId] = useState("");

  // Fetch user data
  useEffect(() => {
    if (!user?.id) return navigate("/login");

    axios.get(`http://localhost:5000/users/${user.id}`).then((res) => {
      if (res.data.address) setSavedAddress(res.data.address);
    });
  }, []);

  // Update address fields
  const updateField = (setter, prev, e) => {
    setter({ ...prev, [e.target.name]: e.target.value });
  };

  const handleResetSaved = () => {
    setSavedAddress(empty);
    setEditSaved(false);
    toast.info("Saved address cleared");
  };

  const handleResetNew = () => {
    setNewAddress(empty);
    setEditNew(false);
  };

  const validate = (data) =>
    Object.values(data).every((v) => v.trim() !== "");

  // ⭐ PLACE ORDER FUNCTION
  const placeOrder = async () => {
    const useAddress = addressMode === "saved" ? savedAddress : newAddress;

    if (!validate(useAddress)) return toast.error("Fill all address fields");
    if (paymentMethod === "UPI" && !upiId) return toast.error("Enter UPI ID");

    try {
      // Fetch fresh user (and past orders)
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      const userData = res.data;

      // Create new order object
      const newOrder = {
        id: Date.now(),
        items: cart,
        total: cart.reduce((t, i) => t + i.price * i.quantity, 0),
        date: new Date().toLocaleString(),
        paymentMethod,
        upiId,
        shippingAddress: useAddress,
        status: "Placed",
      };

      // --------------------------------------------
      // 🔥 UPDATE PRODUCT STOCK (Option B logic)
      // --------------------------------------------
      for (const item of cart) {
        try {
          // fetch latest stock from DB
          const productRes = await axios.get(
            `http://localhost:5000/products/${item.id}`
          );

          const freshStock = productRes.data.stock;

          // reduce stock
          await axios.patch(`http://localhost:5000/products/${item.id}`, {
            stock: freshStock - item.quantity,
          });
        } catch {
          toast.error(`Failed to update stock for ${item.name}`);
        }
      }

      // Save order + clear cart + save address
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        orders: [...(userData.orders || []), newOrder],
        cart: [],
        address: useAddress,
      });

      setCart([]);
      toast.success("Order placed successfully 🎉");
      navigate("/orders");

    } catch (err) {
      toast.error("Failed to place order ❌");
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="bg-black text-white min-h-screen px-6 sm:px-20 py-16">

      <h1 className="text-3xl font-bold text-center mb-10">
        PAYMENT & <span className="text-red-600">SHIPPING</span>
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        
        {/* LEFT SIDE */}
        <div className="bg-[#111] border border-gray-700 rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

          {/* SAVED ADDRESS */}
          <div className="border border-gray-700 p-4 rounded mb-4">
            <div className="flex gap-3 cursor-pointer">
              <input
                type="radio"
                checked={addressMode === "saved"}
                onChange={() => setAddressMode("saved")}
              />

              <div className="w-full">
                <p className="font-semibold mb-2">Saved Address</p>

                {!editSaved ? (
                  <>
                    {savedAddress.fullName === "" ? (
                      <p className="text-gray-500 text-sm">
                        Click edit to add an address
                      </p>
                    ) : (
                      <>
                        <p>{savedAddress.fullName}</p>
                        <p>{savedAddress.phone}</p>
                        <p>{savedAddress.street}</p>
                        <p>
                          {savedAddress.city}, {savedAddress.state} -{" "}
                          {savedAddress.pincode}
                        </p>
                      </>
                    )}

                    <button
                      className="text-red-500 underline text-sm mt-3"
                      onClick={() => setEditSaved(true)}
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    {Object.keys(savedAddress).map((key) => (
                      <input
                        key={key}
                        name={key}
                        value={savedAddress[key]}
                        placeholder={key}
                        onChange={(e) =>
                          updateField(setSavedAddress, savedAddress, e)
                        }
                        className="w-full bg-black border border-gray-600 px-3 py-2 rounded mt-2"
                      />
                    ))}

                    <div className="flex gap-2 mt-3">
                      <button
                        className="bg-red-600 px-4 py-2 rounded"
                        onClick={() => setEditSaved(false)}
                      >
                        Save
                      </button>

                      <button
                        className="bg-gray-600 px-4 py-2 rounded"
                        onClick={handleResetSaved}
                      >
                        Reset
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* NEW ADDRESS */}
          <div className="border border-gray-700 p-4 rounded">
            <div className="flex gap-3 cursor-pointer">
              <input
                type="radio"
                checked={addressMode === "new"}
                onChange={() => setAddressMode("new")}
              />

              <div className="w-full">
                <p className="font-semibold mb-2">New Address</p>

                {!editNew ? (
                  <>
                    <p className="text-gray-500 text-sm">
                      Click edit to enter new address.
                    </p>

                    <button
                      className="text-red-500 underline text-sm mt-3"
                      onClick={() => setEditNew(true)}
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    {Object.keys(newAddress).map((key) => (
                      <input
                        key={key}
                        name={key}
                        value={newAddress[key]}
                        placeholder={key}
                        onChange={(e) =>
                          updateField(setNewAddress, newAddress, e)
                        }
                        className="w-full bg-black border border-gray-600 px-3 py-2 rounded mt-2"
                      />
                    ))}

                    <div className="flex gap-2 mt-3">
                      <button
                        className="bg-red-600 px-4 py-2 rounded"
                        onClick={() => setEditNew(false)}
                      >
                        Save
                      </button>

                      <button
                        className="bg-gray-600 px-4 py-2 rounded"
                        onClick={handleResetNew}
                      >
                        Reset
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#111] border border-gray-700 rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-2 text-sm">
              <p>
                {item.name} × {item.quantity}
              </p>
              <p>
                {currency}
                {item.price * item.quantity}
              </p>
            </div>
          ))}

          <h3 className="text-red-500 font-bold mt-3">
            Total {currency}
            {cart.reduce((t, i) => t + i.price * i.quantity, 0)}
          </h3>

          {/* PAYMENT OPTIONS */}
          <div className="mt-5">
            <label className="flex gap-2 mb-2 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery
            </label>

            <label className="flex gap-2 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
              />
              UPI
            </label>

            {paymentMethod === "UPI" && (
              <input
                className="w-full bg-black border border-gray-700 px-3 py-2 mt-2"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            )}
          </div>

          <button
            onClick={placeOrder}
            className="mt-6 bg-red-600 hover:bg-red-700 w-full py-3 rounded font-semibold"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
