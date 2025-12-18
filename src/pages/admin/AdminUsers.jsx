import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = "http://localhost:5000/users";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

 
  const loadUsers = async () => {
    try {
      const res = await axios.get(API);

      const updatedUsers = res.data.map((u) =>
        u.blocked === undefined ? { ...u, blocked: false } : u
      );

      setUsers(updatedUsers);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  
  const toggleBlock = async (user) => {
    const newStatus = !user.blocked;

    try {
      await axios.patch(`${API}/${user.id}`, {
        blocked: newStatus,
      });

      toast.success(
        newStatus ? "User blocked successfully" : "User unblocked successfully"
      );

      loadUsers();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Users</h2>

      {users.map((u) => (
        <div
          key={u.id}
          className="bg-[#111] border border-gray-700 p-5 mb-4 rounded"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">{u.name}</p>
              <p className="text-gray-400">{u.email}</p>

              
              {u.address && (
                <div className="mt-3 text-sm text-gray-300">
                  <p className="text-red-500 font-semibold">Address</p>
                  <p>{u.address.fullName}</p>
                  <p>{u.address.phone}</p>
                  <p>{u.address.street}</p>
                  <p>
                    {u.address.city}, {u.address.state} -{" "}
                    {u.address.pincode}
                  </p>
                </div>
              )}

              {u.blocked && (
                <p className="text-red-500 text-sm mt-2 font-semibold">
                  BLOCKED
                </p>
              )}
            </div>

            <button
              onClick={() => toggleBlock(u)}
              className={`px-4 py-2 ${
                u.blocked ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {u.blocked ? "Unblock" : "Block"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;
