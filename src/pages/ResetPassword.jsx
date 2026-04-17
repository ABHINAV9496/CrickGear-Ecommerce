import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/password-reset-confirm/", {
        uidb64: uid,
        token: token,
        new_password: newPassword,
      });
      toast.success(res.data.detail || "Password reset successful!");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid or expired token";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-2">UPDATE PASSWORD</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="new_password"
            type="password"
            placeholder="New Password"
            required
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Set New Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
