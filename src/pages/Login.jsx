import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import api from "../api";
import { toast } from "react-toastify";

const Login = () => {
  const { setUser } = useContext(shopContext);
  const navigate    = useNavigate();

  const [isLogin, setIsLogin] = useState(true); 
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username:   "",
    password:   "",
    email:      "",
    first_name: "",
    last_name:  "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post("/auth/login/", {
          username: form.username,
          password: form.password,
        });

        
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);

     
        setUser(res.data.user);

        toast.success("Welcome back!");
        navigate("/");

      } else {
        
        const res = await api.post("/auth/register/", {
          username:   form.username,
          password:   form.password,
          email:      form.email,
          first_name: form.first_name,
          last_name:  form.last_name,
        });

        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        setUser(res.data.user);

        toast.success("Account created! Welcome!");
        navigate("/");
      }
    } catch (err) {
    
      const msg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {})?.[0]?.[0] ||
        "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-center mb-2">
          {isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          {isLogin ? "Login to your CrickGear account" : "Join CrickGear today"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

         
          {!isLogin && (
            <>
              <input
                name="first_name"
                placeholder="First Name"
                onChange={handleChange}
                className="bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
              />
              <input
                name="last_name"
                placeholder="Last Name"
                onChange={handleChange}
                className="bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                className="bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
              />
            </>
          )}

          
          <input
            name="username"
            placeholder="Username"
            required
            onChange={handleChange}
            className="bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="bg-black border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

       
        <p
          className="text-center text-sm text-gray-400 mt-6 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="text-red-500 hover:text-red-400 font-semibold">
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;