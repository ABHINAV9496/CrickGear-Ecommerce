import { createContext, useEffect, useState } from "react";
import api from "../api";

export const shopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [cart, setCart]               = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const currency = "₹";

  // ── When app first loads, check if user is already logged in ──
  // We check by sending the saved token to Django
  // If Django accepts it, we get the user data back
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoadingCart(false);
      return;
    }
    api.get("/auth/profile/")
      .then((res) => setUser(res.data))
      .catch(() => {
        // Token is invalid or expired — clear it
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      })
      .finally(() => setLoadingCart(false));
  }, []);

  // ── When app loads, restore cart from localStorage ────────────
  // localStorage keeps the cart even after browser refresh
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {
      setCart([]);
    }
    setLoadingCart(false);
  }, []);

  // ── Every time cart changes, save it to localStorage ──────────
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ── Logout: clear everything ──────────────────────────────────
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("cart");
    setUser(null);
    setCart([]);
  };

  return (
    <shopContext.Provider
      value={{ user, setUser, cart, setCart, loadingCart, currency, logout }}
    >
      {children}
    </shopContext.Provider>
  );
};

export default ShopContextProvider;