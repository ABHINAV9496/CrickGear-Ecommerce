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
    <div className="bg-black min-h-screen flex items-center justify-center">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 gap-4 text-gray-300 border border-gray-700 p-8 rounded"
      >
        <p className="text-3xl font-semibold text-white mb-4">
          {currentState}
        </p>

        {currentState === "Sign Up" && (
          <input
            className="w-full px-3 py-2 bg-black border border-gray-700"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          className="w-full px-3 py-2 bg-black border border-gray-700"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full px-3 py-2 bg-black border border-gray-700"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="w-full flex justify-between text-sm">
          <p></p>

          {currentState === "Login" ? (
            <p
              className="text-red-500 cursor-pointer"
              onClick={() => setCurrentState("Sign Up")}
            >
              Create Account
            </p>
          ) : (
            <p
              className="text-red-500 cursor-pointer"
              onClick={() => setCurrentState("Login")}
            >
              Login Here
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-red-600 w-full py-2 hover:bg-red-700"
        >
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
