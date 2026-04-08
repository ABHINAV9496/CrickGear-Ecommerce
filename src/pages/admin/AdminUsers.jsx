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
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold tracking-wider uppercase text-white">User Accounts</h2>
      </div>

      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-colors p-6 rounded-lg relative overflow-hidden"
          >
            {u.blocked && (
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.7)]"></div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-xl font-bold text-red-500 uppercase tracking-wide">{u.name}</p>
                  {u.blocked && (
                    <span className="bg-red-600/10 text-red-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-red-500/20">
                      Suspended
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm font-medium">{u.email}</p>

                {u.address && (
                  <div className="mt-4 bg-[#111] border border-gray-800/50 p-4 rounded-md">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 border-b border-gray-800 pb-1">Primary Dispatch Address</p>
                    <div className="text-sm text-gray-400 flex flex-col gap-0.5">
                      <p className="text-gray-300 font-semibold">{u.address.fullName} <span className="text-gray-500 font-normal">({u.address.phone})</span></p>
                      <p>{u.address.street}</p>
                      <p>
                        {u.address.city}, {u.address.state} - {u.address.pincode}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => toggleBlock(u)}
                className={`px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all ${
                  u.blocked 
                    ? "border border-green-800 text-green-500 hover:bg-green-600 hover:text-white hover:border-green-600 shadow-lg hover:shadow-green-600/20" 
                    : "border border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
                }`}
              >
                {u.blocked ? "Restore Access" : "Revoke Access"}
              </button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="text-center py-20 bg-[#0a0a0a] border border-gray-800 rounded-lg">
             <p className="text-gray-500">No user records detected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
