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
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <form
        onSubmit={loginAdmin}
        className="bg-[#111] border border-gray-700 p-8 rounded w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          ADMIN <span className="text-red-600">LOGIN</span>
        </h2>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black border border-gray-600 px-4 py-2 rounded mb-4"
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black border border-gray-600 px-4 py-2 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
