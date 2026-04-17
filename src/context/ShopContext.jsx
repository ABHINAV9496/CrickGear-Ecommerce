import { createContext, useEffect, useState } from "react";
import api from "../api";

export const shopContext = createContext();

const mapItem = (item) => ({
  cartItemId: item.id,            
  id:         item.product,       
  name:       item.product_name,
  price:      parseFloat(item.product_price),
  image:      item.product_image,
  quantity:   item.quantity,
  size:       item.size || null,
  stock:      999,                
});

const ShopContextProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [cart, setCart]               = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const currency = "₹";

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/");
      setCart((res.data.items || []).map(mapItem));
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { setLoadingCart(false); return; }

    api.get("/auth/profile/")
      .then((res) => {
        setUser(res.data);
        return fetchCart();          
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      })
      .finally(() => setLoadingCart(false));
  }, []);


  const addToCart = async (product, quantity = 1, size = "") => {
    const res = await api.post("/cart/update/", {
      product_id: product.id,
      quantity,
      size: size || "",
    });
    setCart((res.data.items || []).map(mapItem));
  };

  
  const updateCartItem = async (cartItemId, quantity) => {
    const res = await api.put("/cart/update/", { item_id: cartItemId, quantity });
    setCart((res.data.items || []).map(mapItem));
  };

  
  const removeCartItem = async (cartItemId) => {
    const res = await api.delete("/cart/update/", { data: { item_id: cartItemId } });
    setCart((res.data.items || []).map(mapItem));
  };

  
  const clearCart = async () => {
    await api.post("/cart/clear/");
    setCart([]);
  };

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