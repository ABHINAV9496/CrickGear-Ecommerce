import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
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

    axios
      .get(`http://localhost:5000/users/${user.id}`)
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
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
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
    <div className="bg-black text-white min-h-screen px-6 sm:px-20 py-16">

      <h1 className="text-3xl font-bold mb-10 text-center">
        MY <span className="text-red-600">PROFILE</span>
      </h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT — ACCOUNT DETAILS + ADDRESS */}
        <div className="bg-[#111] border border-gray-700 rounded p-6">

          <h2 className="text-xl font-semibold mb-4">
            Account Details
          </h2>

          <div className="mb-4">
            <p className="text-gray-400 text-sm">Name</p>
            <p className="text-lg">{userData.name}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-lg">{userData.email}</p>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3 flex justify-between items-center">
            Default Shipping Address

            <button
              onClick={() => setEditingAddress(!editingAddress)}
              className="text-sm text-red-500 underline hover:text-red-400"
            >
              {editingAddress ? "Cancel" : "Edit"}
            </button>
          </h3>

          {/* SHOW DEFAULT ADDRESS */}
          {!editingAddress && (
            <>
              {userData.address ? (
                <div className="text-sm text-gray-300 space-y-1">
                  <p>{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No address saved yet.
                </p>
              )}
            </>
          )}

          {/* EDIT ADDRESS FORM */}
          {editingAddress && (
            <div className="text-sm space-y-3 mt-4">

              {Object.keys(addressForm).map((key) => (
                <input
                  key={key}
                  type="text"
                  name={key}
                  value={addressForm[key]}
                  onChange={handleAddressChange}
                  placeholder={key}
                  className="w-full bg-black border border-gray-700 px-3 py-2 rounded"
                />
              ))}

              <button
                onClick={saveAddress}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
              >
                Save Address
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — RECENT ORDERS */}
        <div className="bg-[#111] border border-gray-700 rounded p-6">

          <h2 className="text-xl font-semibold mb-4">
            Your Recent Orders
          </h2>

          {!userData.orders || userData.orders.length === 0 ? (
            <p className="text-sm text-gray-400">
              You haven't placed any orders yet.
            </p>
          ) : (
            <div className="space-y-4 text-sm">

              {userData.orders
                .slice()
                .reverse()
                .slice(0, 3)
                .map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-700 rounded p-3"
                  >
                    <div className="flex justify-between mb-1">
                      <p className="font-semibold">
                        Order #{order.id.toString().slice(-5)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.date}
                      </p>
                    </div>

                    <p className="text-gray-300">
                      Items: {order.items?.length || 0}
                    </p>

                    <p className="text-gray-300">
                      Total:{" "}
                      <span className="text-red-500">
                        {currency}{order.total}
                      </span>
                    </p>

                    <p className="text-gray-400 text-xs mt-1">
                      Payment: {order.paymentMethod || "COD"}
                    </p>

                    <p
                      className={`text-xs mt-1 font-semibold ${
                        order.status === "Cancelled"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      Status: {order.status || "Placed"}
                    </p>
                  </div>
                ))}

              <button
                onClick={() => navigate("/orders")}
                className="mt-4 text-sm text-red-500 underline hover:text-red-400"
              >
                View all orders
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;

