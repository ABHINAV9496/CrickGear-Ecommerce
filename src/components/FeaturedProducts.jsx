import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { user, setCart } = useContext(shopContext);

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        // Group by category to pick 4 different categories
        const productsByCategory = {};
        res.data.forEach(p => {
          if (!productsByCategory[p.category]) {
            productsByCategory[p.category] = p;
          }
        });
        
        // Take up to 4 distinct products
        let uniqueProducts = Object.values(productsByCategory).slice(0, 4);
        
        // If less than 4 categories exist, fill the rest from other products
        if (uniqueProducts.length < 4) {
          const addedIds = new Set(uniqueProducts.map(p => p.id));
          const remaining = res.data.filter(p => !addedIds.has(p.id));
          uniqueProducts = [...uniqueProducts, ...remaining].slice(0, 4);
        }

        setProducts(uniqueProducts);
      })
      .catch(() => console.error("Failed to load featured products"));
  }, []);

  const getImageSrc = (image) => {
    if (!image) return "";
    if (image.startsWith("http") || image.startsWith("/")) {
      return image;
    }
    return assets[image];
  };

  const handleAddToCart = async (product) => {
    if (!user?.id) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      let cart = res.data.cart || [];

      const index = cart.findIndex((item) => item.id === product.id);

      if (index !== -1) {
        if (cart[index].quantity < product.stock) {
          cart[index].quantity += 1;
        } else {
          toast.error("Stock limit reached!");
          return;
        }
      } else {
        cart.push({
          ...product,
          quantity: 1,
          size: product.sizes ? product.sizes[0] : null,
        });
      }

      await axios.patch(`http://localhost:5000/users/${user.id}`, { cart });
      setCart(cart);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async (product) => {
    await handleAddToCart(product);
    navigate("/cart");
  };

  return (
    <div className="py-12 md:py-20 relative w-full text-white">
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight hero-fade">
          FEATURED <span className="text-red-600">GEAR</span>
        </h2>
        <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-xl mx-auto hero-fade animation-delay-100">
          Our most popular and highly-rated cricket equipment, crafted for excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto px-4">
        {products.map((item, index) => (
          <div
            key={item.id}
            className={`group relative bg-[#1c1c1c] border border-gray-700/50 rounded-2xl overflow-hidden hover:border-red-600/50 hover:shadow-lg transition-all duration-400 transform hover:-translate-y-1.5 flex flex-col hero-fade`}
            style={{ animationDelay: `${index * 100 + 100}ms` }}
          >
            {/* Subtle hover overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
            
            {/* Image Wrapper */}
            <div
              onClick={() => navigate(`/product/${item.id}`)}
              className="h-56 bg-white flex items-center justify-center p-6 cursor-pointer relative overflow-hidden"
            >
              <img
                src={getImageSrc(item.image)}
                alt={item.name}
                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            <div className="p-5 flex flex-col grow">
              <div className="mb-4 grow">
                <p className="text-xs text-gray-500 tracking-widest uppercase font-semibold mb-1">{item.category}</p>
                <h3 className="font-bold text-lg leading-snug line-clamp-2 text-gray-200 group-hover:text-red-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-red-500 font-extrabold text-lg mt-2 tracking-tight">
                  ₹{item.price}
                </p>
              </div>

              <div className="flex gap-2 mt-auto relative z-20">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-[#2a2a2a] border border-gray-600 text-gray-300 rounded-lg py-2.5 text-xs font-bold hover:bg-red-600/10 hover:border-red-600 hover:text-red-500 transition-all duration-300"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => handleBuyNow(item)}
                  className="flex-1 bg-red-600 text-white rounded-lg py-2.5 text-xs font-bold hover:bg-red-500 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
