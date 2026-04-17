import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/password-reset/", { email });
      toast.success(res.data.detail || "Reset link sent!");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.detail || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-2">RECOVER ACCOUNT</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your email address to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p
          className="text-center text-sm text-gray-400 mt-6 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Remember your password?{" "}
          <span className="text-red-500 hover:text-red-400 font-semibold">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
