import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, currency } = useContext(shopContext);
  const [userData, setUserData] = useState(null);
  const [editingAddress, setEditingAddress] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view profile");
      navigate("/login");
      return;
    }

    api
      .get(`/users/${user.id}`)
      .then((res) => {
        setUserData(res.data);

        if (res.data.address) {
          setAddressForm(res.data.address);
        }
      })
      .catch(() => {
        toast.error("Failed to load profile data");
      });
  }, [user, navigate]);

  if (!userData) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  const addr = userData.address || {};

  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async () => {
    if (
      !addressForm.fullName ||
      !addressForm.phone ||
      !addressForm.street ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.pincode
    ) {
      toast.error("Please fill all address fields");
      return;
    }

    try {
      await api.patch(`/users/${user.id}`, {
        address: addressForm,
      });

      setUserData({ ...userData, address: addressForm });
      setEditingAddress(false);
      toast.success("Address updated successfully!");
    } catch {
      toast.error("Failed to update address");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pt-16 pb-24 text-white px-6 sm:px-20 animate-fade-in-up">
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-wider">
          MY <span className="text-red-600">PROFILE</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm">Manage your account and shipping address</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-5xl mx-auto">
        
        {/* Left: Account & Address */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          
          <div>
             <h2 className="text-lg font-semibold border-b border-gray-800 pb-2 mb-4">Account Details</h2>
             <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-[#0a0a0a] p-3 rounded">
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-md font-medium">{userData.name}</p>
                </div>
                <div className="flex justify-between items-center bg-[#0a0a0a] p-3 rounded">
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-md font-medium">{userData.email}</p>
                </div>
             </div>
          </div>

          <div>
             <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
               <h2 className="text-lg font-semibold">Shipping Address</h2>
               <button onClick={() => setEditingAddress(!editingAddress)} className="text-xs text-red-500 hover:text-red-400 font-semibold uppercase tracking-wider">
                  {editingAddress ? "Cancel" : "Edit"}
               </button>
             </div>

             {!editingAddress ? (
                <>
                  {userData.address ? (
                    <div className="bg-[#0a0a0a] p-4 text-sm text-gray-300 space-y-2 rounded border border-gray-800/50">
                      <p><span className="text-gray-500 w-20 inline-block">Name:</span> {addr.fullName}</p>
                      <p><span className="text-gray-500 w-20 inline-block">Phone:</span> {addr.phone}</p>
                      <p><span className="text-gray-500 w-20 inline-block">Street:</span> {addr.street}</p>
                      <p><span className="text-gray-500 w-20 inline-block">City:</span> {addr.city}, {addr.state}</p>
                      <p><span className="text-gray-500 w-20 inline-block">Pincode:</span> {addr.pincode}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">No address saved yet.</p>
                  )}
                </>
             ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <input type="text" name="fullName" value={addressForm.fullName || ''} onChange={handleAddressChange} placeholder="Full Name" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors rounded" />
                  <input type="text" name="phone" value={addressForm.phone || ''} onChange={handleAddressChange} placeholder="Phone Number" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors rounded" />
                  <input type="text" name="street" value={addressForm.street || ''} onChange={handleAddressChange} placeholder="Street Address" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors rounded" />
                  <div className="flex gap-3">
                    <input type="text" name="city" value={addressForm.city || ''} onChange={handleAddressChange} placeholder="City" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors rounded" />
                    <input type="text" name="state" value={addressForm.state || ''} onChange={handleAddressChange} placeholder="State" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors rounded" />
                  </div>
                  <input type="text" name="pincode" value={addressForm.pincode || ''} onChange={handleAddressChange} placeholder="Pincode" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors rounded" />
                  
                  <button onClick={saveAddress} className="mt-2 bg-red-600 hover:bg-red-500 text-white font-medium text-sm py-3 px-6 transition-colors rounded">Save Address</button>
                </div>
             )}
          </div>
        </div>

        {/* Right: Recent Orders */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <h2 className="text-lg font-semibold border-b border-gray-800 pb-2 mb-4">Recent Orders</h2>
          
          {!userData.orders || userData.orders.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No recent orders found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {userData.orders.slice().reverse().slice(0, 3).map((order) => (
                <div key={order.id} className="group bg-[#0a0a0a] p-4 rounded hover:bg-[#111] transition-colors border border-gray-800/50 hover:border-gray-700">
                   <div className="flex justify-between items-center mb-2">
                      <p className="text-md font-semibold text-gray-200">Order #{order.id.toString().slice(-5)}</p>
                      <p className={`text-xs font-semibold uppercase px-2 py-1 rounded bg-[#151515] ${order.status === "Cancelled" ? "text-red-500" : "text-green-500"}`}>
                        {order.status || "Placed"}
                      </p>
                   </div>
                   <div className="flex justify-between items-center text-sm text-gray-400">
                      <p>{order.date}</p>
                      <p className="font-medium text-white">{currency}{order.total}</p>
                   </div>
                </div>
              ))}
              
              <button onClick={() => navigate("/orders")} className="mt-4 text-sm font-medium text-red-500 hover:text-red-400 text-right transition-colors self-end">
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

