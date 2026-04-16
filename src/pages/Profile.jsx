import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, currency, logout } = useContext(shopContext);
  const [userData, setUserData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", pincode: "",
  });
  const navigate = useNavigate();


  useEffect(() => {
    if (!user) { navigate("/login"); return; }


    api.get("/auth/profile/")
      .then((res) => {
        setUserData(res.data);
        if (res.data.address) {
          const a = res.data.address;
          setAddressForm({
            fullName: a.full_name,
            phone: a.phone,
            street: a.street,
            city: a.city,
            state: a.state,
            pincode: a.pincode,
          });
        }
      })
      .catch(() => toast.error("Failed to load profile"));


    api.get("/orders/my/")
      .then((res) => setRecentOrders(res.data.slice(0, 3)))
      .catch(() => { });
  }, [user, navigate]);

  const handleAddressChange = (e) =>
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });


  const saveAddress = async () => {
    const { fullName, phone, street, city, state, pincode } = addressForm;
    if (!fullName || !phone || !street || !city || !state || !pincode) {
      toast.error("Please fill all address fields");
      return;
    }
    try {
      await api.post("/auth/address/", {
        full_name: fullName,
        phone, street, city, state, pincode,
      });
      setEditingAddress(false);
      toast.success("Address updated successfully!");
    } catch {
      toast.error("Failed to update address");
    }
  };

  if (!userData) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pt-16 pb-24 text-white px-6 sm:px-20 animate-fade-in-up">

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-wider">
          MY <span className="text-red-600">PROFILE</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm">Manage your account and shipping address</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-5xl mx-auto">

        <div className="w-full lg:w-1/2 flex flex-col gap-8">


          <div>
            <h2 className="text-lg font-semibold border-b border-gray-800 pb-2 mb-4">Account Details</h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center bg-[#0a0a0a] p-3 rounded">
                <p className="text-gray-400 text-sm">Username</p>
                <p className="font-medium">{userData.username}</p>
              </div>
              <div className="flex justify-between items-center bg-[#0a0a0a] p-3 rounded">
                <p className="text-gray-400 text-sm">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
              {userData.first_name && (
                <div className="flex justify-between items-center bg-[#0a0a0a] p-3 rounded">
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="font-medium">{userData.first_name} {userData.last_name}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="mt-4 w-full border border-red-800 text-red-500 hover:bg-red-600 hover:text-white py-2 rounded text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <button
                onClick={() => setEditingAddress(!editingAddress)}
                className="text-xs text-red-500 hover:text-red-400 font-semibold uppercase tracking-wider"
              >
                {editingAddress ? "Cancel" : "Edit"}
              </button>
            </div>

            {!editingAddress ? (
              userData.address ? (
                <div className="bg-[#0a0a0a] p-4 text-sm text-gray-300 space-y-2 rounded border border-gray-800/50">
                  <p><span className="text-gray-500 w-20 inline-block">Name:</span> {addressForm.fullName}</p>
                  <p><span className="text-gray-500 w-20 inline-block">Phone:</span> {addressForm.phone}</p>
                  <p><span className="text-gray-500 w-20 inline-block">Street:</span> {addressForm.street}</p>
                  <p><span className="text-gray-500 w-20 inline-block">City:</span> {addressForm.city}, {addressForm.state}</p>
                  <p><span className="text-gray-500 w-20 inline-block">Pincode:</span> {addressForm.pincode}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">No address saved yet. Click Edit to add one.</p>
              )
            ) : (
              <div className="flex flex-col gap-3">
                {[
                  { name: "fullName", placeholder: "Full Name" },
                  { name: "phone", placeholder: "Phone Number" },
                  { name: "street", placeholder: "Street Address" },
                  { name: "city", placeholder: "City" },
                  { name: "state", placeholder: "State" },
                  { name: "pincode", placeholder: "Pincode" },
                ].map((field) => (
                  <input
                    key={field.name}
                    type="text"
                    name={field.name}
                    value={addressForm[field.name] || ""}
                    onChange={handleAddressChange}
                    placeholder={field.placeholder}
                    className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors rounded"
                  />
                ))}
                <button
                  onClick={saveAddress}
                  className="mt-2 bg-red-600 hover:bg-red-500 text-white font-medium text-sm py-3 px-6 transition-colors rounded"
                >
                  Save Address
                </button>
              </div>
            )}
          </div>
        </div>


        <div className="w-full lg:w-1/2 flex flex-col">
          <h2 className="text-lg font-semibold border-b border-gray-800 pb-2 mb-4">Recent Orders</h2>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No recent orders found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="bg-[#0a0a0a] p-4 rounded border border-gray-800/50 hover:border-gray-700 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-200">Order #{order.id}</p>
                    <p className={`text-xs font-semibold uppercase px-2 py-1 rounded ${order.status === "Cancelled" ? "text-red-500" : "text-green-500"
                      }`}>
                      {order.status}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <p>{new Date(order.created_at).toLocaleDateString()}</p>
                    <p className="font-medium text-white">{currency}{order.total}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate("/orders")}
                className="mt-2 text-sm font-medium text-red-500 hover:text-red-400 text-right transition-colors self-end"
              >
                View All Orders →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;