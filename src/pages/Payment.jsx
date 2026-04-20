import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const empty = { fullName: "", phone: "", street: "", city: "", state: "", pincode: "" };

const Payment = () => {
  const { user, cart, setCart, currency } = useContext(shopContext);
  const navigate = useNavigate();

  const [savedAddress, setSavedAddress] = useState(empty);
  const [editSaved, setEditSaved] = useState(false);
  const [newAddress, setNewAddress] = useState(empty);
  const [editNew, setEditNew] = useState(false);
  const [addressMode, setAddressMode] = useState("saved");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!user?.id) { navigate("/login"); return; }
    api.get("/auth/profile/")
      .then((res) => {
        if (res.data.address) {
          const a = res.data.address;
          setSavedAddress({
            fullName: a.full_name,
            phone: a.phone,
            street: a.street,
            city: a.city,
            state: a.state,
            pincode: a.pincode,
          });
        }
      });
  }, []);

  const updateField = (setter, prev, e) =>
    setter({ ...prev, [e.target.name]: e.target.value });

  const validate = (data) => Object.values(data).every((v) => v.trim() !== "");


  const placeOrder = async () => {
    const useAddress = addressMode === "saved" ? savedAddress : newAddress;
    if (!validate(useAddress)) return toast.error("Fill all address fields");
    if (paymentMethod === "UPI" && !upiId) return toast.error("Enter UPI ID");

    setLoading(true);
    try {
      await api.post("/orders/place/", {
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || "",
          image: item.image || "",
        })),
        total: cart.reduce((t, i) => t + i.price * i.quantity, 0),
        paymentMethod,
        upiId,
        shippingAddress: useAddress,
      });


      await api.post("/auth/address/", {
        full_name: useAddress.fullName,
        phone: useAddress.phone,
        street: useAddress.street,
        city: useAddress.city,
        state: useAddress.state,
        pincode: useAddress.pincode,
      });

      setCart([]);
      toast.success("Order placed successfully 🎉");
      navigate("/orders");
    } catch {
      toast.error("Failed to place order ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen px-6 sm:px-20 py-16">
      <h1 className="text-3xl font-bold text-center mb-10">
        PAYMENT & <span className="text-red-600">SHIPPING</span>
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">


        <div className="bg-[#111] border border-gray-700 rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>


          <div className="border border-gray-700 p-4 rounded mb-4">
            <div className="flex gap-3">
              <input type="radio" checked={addressMode === "saved"} onChange={() => setAddressMode("saved")} />
              <div className="w-full">
                <p className="font-semibold mb-2">Saved Address</p>
                {!editSaved ? (
                  <>
                    {savedAddress.fullName === "" ? (
                      <p className="text-gray-500 text-sm">Click edit to add an address</p>
                    ) : (
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>{savedAddress.fullName}</p>
                        <p>{savedAddress.phone}</p>
                        <p>{savedAddress.street}</p>
                        <p>{savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}</p>
                      </div>
                    )}
                    <button className="text-red-500 underline text-sm mt-3" onClick={() => setEditSaved(true)}>Edit</button>
                  </>
                ) : (
                  <>
                    {Object.keys(savedAddress).map((key) => (
                      <input key={key} name={key} value={savedAddress[key]} placeholder={key}
                        onChange={(e) => updateField(setSavedAddress, savedAddress, e)}
                        className="w-full bg-black border border-gray-600 px-3 py-2 rounded mt-2 text-sm" />
                    ))}
                    <div className="flex gap-2 mt-3">
                      <button className="bg-red-600 px-4 py-2 rounded text-sm" onClick={() => setEditSaved(false)}>Save</button>
                      <button className="bg-gray-600 px-4 py-2 rounded text-sm" onClick={() => { setSavedAddress(empty); setEditSaved(false); }}>Reset</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>


          <div className="border border-gray-700 p-4 rounded">
            <div className="flex gap-3">
              <input type="radio" checked={addressMode === "new"} onChange={() => setAddressMode("new")} />
              <div className="w-full">
                <p className="font-semibold mb-2">New Address</p>
                {!editNew ? (
                  <>
                    <p className="text-gray-500 text-sm">Click edit to enter new address.</p>
                    <button className="text-red-500 underline text-sm mt-3" onClick={() => setEditNew(true)}>Edit</button>
                  </>
                ) : (
                  <>
                    {Object.keys(newAddress).map((key) => (
                      <input key={key} name={key} value={newAddress[key]} placeholder={key}
                        onChange={(e) => updateField(setNewAddress, newAddress, e)}
                        className="w-full bg-black border border-gray-600 px-3 py-2 rounded mt-2 text-sm" />
                    ))}
                    <div className="flex gap-2 mt-3">
                      <button className="bg-red-600 px-4 py-2 rounded text-sm" onClick={() => setEditNew(false)}>Save</button>
                      <button className="bg-gray-600 px-4 py-2 rounded text-sm" onClick={() => { setNewAddress(empty); setEditNew(false); }}>Reset</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>


        <div className="bg-[#111] border border-gray-700 rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-2 text-sm text-gray-300">
              <p>{item.name} × {item.quantity}</p>
              <p>{currency}{item.price * item.quantity}</p>
            </div>
          ))}

          <p className="text-red-500 font-bold mt-3 text-lg">
            Total {currency}{cart.reduce((t, i) => t + i.price * i.quantity, 0)}
          </p>


          <div className="mt-5 flex flex-col gap-2">
            <label className="flex gap-2 cursor-pointer text-sm">
              <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
              Cash on Delivery
            </label>
            <label className="flex gap-2 cursor-pointer text-sm">
              <input type="radio" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} />
              UPI
            </label>
            {paymentMethod === "UPI" && (
              <input
                className="w-full bg-black border border-gray-700 px-3 py-2 mt-1 rounded text-sm"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            )}
          </div>

          <button
            onClick={placeOrder}
            disabled={loading || cart.length === 0}
            className="mt-6 bg-red-600 hover:bg-red-700 w-full py-3 rounded font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;