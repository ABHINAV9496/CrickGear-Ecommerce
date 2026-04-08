import { createContext, useEffect, useState } from "react";
import api from "../api";

export const shopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const currency = "₹";
 

  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (!user?.id) {
        setCart([]);
        setLoadingCart(false);
        return;
      }

      try {
        const res = await api.get(
          `/users/${user.id}`
        );

        setCart(res.data.cart || []);
      } catch (err) {
        console.log("Failed to load cart", err);
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();
  }, [user]);

  return (
    <shopContext.Provider
      value={{
        user,
        setUser,
        cart,
        setCart,
        loadingCart,   
        currency,
        
      }}
    >
      {children}
    </shopContext.Provider>
  );
};

export default ShopContextProvider;
