import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(shopContext);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

   
    if (storedUser?.blocked) {
      localStorage.removeItem("user");
      toast.error("Your account is blocked. Contact admin.", {
        theme: "dark",
      });
      return;
    }

    if (storedUser) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (currentState === "Sign Up") {
      const newUser = {
        name,
        email,
        password,
        cart: [],
        orders: [],
        blocked: false,
      };

      try {
        const res = await axios.post(
          "http://localhost:5000/users",
          newUser
        );

        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_email");

        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);

        toast.success("Account created successfully!", {
          theme: "dark",
        });
        navigate("/");
      } catch {
        toast.error("Signup failed!", { theme: "dark" });
      }
    }

   
    else {
      try {
        const res = await axios.get("http://localhost:5000/users");

        const matchedUser = res.data.find(
          (u) => u.email === email && u.password === password
        );

        if (!matchedUser) {
          toast.error("Wrong email or password", { theme: "dark" });
          return;
        }

        
        if (matchedUser.blocked) {
          toast.error("Your account is blocked. Contact admin.", {
            theme: "dark",
          });
          return;
        }

       
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_email");

        localStorage.setItem("user", JSON.stringify(matchedUser));
        setUser(matchedUser);

        toast.success("Login successful!", { theme: "dark" });
        navigate("/");
      } catch {
        toast.error("Server error!", { theme: "dark" });
      }
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-6 animate-fade-in-up">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full max-w-md gap-6 bg-[#0a0a0a] border border-gray-800 p-8 sm:p-10 rounded-lg shadow-2xl relative"
      >
        <div className="text-center mb-2 text-white">
          <h2 className="text-3xl font-bold tracking-wider">
            {currentState === "Login" ? "WELCOME" : "JOIN"} <span className="text-red-600">US</span>
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            {currentState === "Login" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        {currentState === "Sign Up" && (
          <input
            className="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded focus:border-red-600 focus:outline-none transition-colors text-white text-sm"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          className="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded focus:border-red-600 focus:outline-none transition-colors text-white text-sm"
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded focus:border-red-600 focus:outline-none transition-colors text-white text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="w-full flex justify-between items-center text-sm mt-1">
          <p></p>
          {currentState === "Login" ? (
            <p
              className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
              onClick={() => setCurrentState("Sign Up")}
            >
              Create Account
            </p>
          ) : (
            <p
              className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
              onClick={() => setCurrentState("Login")}
            >
              Sign In Instead
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded transition-colors shadow-lg shadow-red-600/20 uppercase tracking-widest mt-2"
        >
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
