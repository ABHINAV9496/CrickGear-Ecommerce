import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const admins = [
    { email: "admin@gmail.com", password: "1234" },
    { email: "admin2@gmail.com", password: "1234" },
  ];

  const loginAdmin = (e) => {
    e.preventDefault();

    const isAdmin = admins.find(
      (admin) =>
        admin.email === email && admin.password === password
    );

    if (isAdmin) {
      
      localStorage.removeItem("user");

      localStorage.setItem("admin_token", "ACTIVE");
      localStorage.setItem("admin_email", email);

      toast.success("Admin logged in!");
      navigate("/admin");
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-6 animate-fade-in-up">
      <form
        onSubmit={loginAdmin}
        className="flex flex-col w-full max-w-md gap-6 bg-[#0a0a0a] border border-gray-800 p-8 sm:p-10 rounded-lg shadow-2xl relative"
      >
        <div className="text-center mb-2 text-white">
          <h2 className="text-3xl font-bold tracking-wider">
            ADMIN <span className="text-red-600">PORTAL</span>
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Sign in to access the control panel
          </p>
        </div>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded focus:border-red-600 focus:outline-none transition-colors text-white text-sm"
          required
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded focus:border-red-600 focus:outline-none transition-colors text-white text-sm"
          required
        />

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded transition-colors shadow-lg shadow-red-600/20 uppercase tracking-widest mt-2"
        >
          Authorize
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
