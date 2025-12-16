import React from "react";

const AdminUserDetails = ({ user }) => {
  if (!user)
    return (
      <div className="bg-[#111] border border-gray-700 p-6 rounded text-gray-400">
        Select a user to view details
      </div>
    );

  return (
    <div className="bg-[#111] border border-gray-700 p-6 rounded">
      <h3 className="font-semibold mb-4">User Details</h3>

      <p className="text-xl font-semibold">{user.name}</p>
      <p className="text-gray-400">{user.email}</p>

      <h4 className="text-red-500 font-semibold mt-6 mb-2">
        Hard-coded Order Details
      </h4>

      <p className="text-gray-300">• Total Orders: 3</p>
      <p className="text-gray-300">• Last Purchase: ₹1299</p>
      <p className="text-gray-300">• Preferred Payment: COD</p>
    </div>
  );
};

export default AdminUserDetails;
