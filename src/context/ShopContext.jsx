import { createContext, useEffect, useState } from "react";
import api from "../api";

export const shopContext = createContext();

// ── Helper: map Django cart item → React cart item ────────────────
const mapItem = (item) => ({
  cartItemId: item.id,            // Django CartItem PK (needed for PUT/DELETE)
  id:         item.product,       // Product ID
  name:       item.product_name,
  price:      parseFloat(item.product_price),
  image:      item.product_image,
  quantity:   item.quantity,
  size:       item.size || null,
  stock:      999,                // stock enforced on backend; set high for UI
});

const ShopContextProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [cart, setCart]               = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const currency = "₹";

  // ── Fetch cart from Django backend ────────────────────────────
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/");
      setCart((res.data.items || []).map(mapItem));
    } catch {
      setCart([]);
    }
  };

  // ── On app boot: restore user session, then load their cart ──
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { setLoadingCart(false); return; }

    api.get("/auth/profile/")
      .then((res) => {
        setUser(res.data);
        return fetchCart();          // load cart after we know who the user is
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      })
      .finally(() => setLoadingCart(false));
  }, []);

  // ── Add item to cart (POST to Django) ─────────────────────────
  const addToCart = async (product, quantity = 1, size = "") => {
    const res = await api.post("/cart/update/", {
      product_id: product.id,
      quantity,
      size: size || "",
    });
    setCart((res.data.items || []).map(mapItem));
  };

  // ── Update quantity of a cart item (PUT to Django) ────────────
  const updateCartItem = async (cartItemId, quantity) => {
    const res = await api.put("/cart/update/", { item_id: cartItemId, quantity });
    setCart((res.data.items || []).map(mapItem));
  };

  // ── Remove a cart item (DELETE to Django) ─────────────────────
  const removeCartItem = async (cartItemId) => {
    const res = await api.delete("/cart/update/", { data: { item_id: cartItemId } });
    setCart((res.data.items || []).map(mapItem));
  };

  // ── Clear entire cart (POST to /cart/clear/) ──────────────────
  const clearCart = async () => {
    await api.post("/cart/clear/");
    setCart([]);
  };

  // ── Logout: clear everything ──────────────────────────────────
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setCart([]);
  };

  return (
    <shopContext.Provider
      value={{
        user, setUser,
        cart, setCart,
        loadingCart,
        currency,
        logout,
        fetchCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </shopContext.Provider>
  );
};

export default ShopContextProvider;