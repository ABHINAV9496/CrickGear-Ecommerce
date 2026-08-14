import React, { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await api.post("/newsletter/subscribe/", { email });
      toast.success(res.data.detail || "Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to subscribe. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center my-28 hero-fade px-4">

      <p className="text-3xl sm:text-4xl font-extrabold text-gray-100 tracking-wide">
        Subscribe & Get <span className="text-red-500">20% Off</span>
      </p>

      <p className="text-gray-400 mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
        Join our cricket community for{" "}
        <span className="text-white font-semibold">exclusive deals</span>, new
        arrivals & special match-day offers.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <input
          className="w-full sm:w-[320px] px-5 py-3 rounded-full bg-gray-900 text-white border border-gray-700 outline-none text-base focus:border-red-600 transition"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white text-base px-12 py-3 rounded-full font-bold tracking-wide transition-all duration-300 hover:shadow-[0_0_15px_rgba(220,38,38,0.8)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "SUBSCRIBING..." : "SUBSCRIBE"}
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
