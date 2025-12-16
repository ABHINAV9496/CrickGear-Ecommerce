import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const { user, setCart } = useContext(shopContext);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        setProducts(res.data);

        // 🔹 CREATE CATEGORY LIST DYNAMICALLY
        const uniqueCategories = [
          "All",
          ...new Set(res.data.map((p) => p.category)),
        ];

        setCategories(uniqueCategories);
      })
      .catch(() => toast.error("Failed to load products"));
  }, []);

  /* ================= IMAGE HANDLER ================= */
  const getImageSrc = (image) => {
    if (!image) return "";
    if (image.startsWith("http") || image.startsWith("/")) {
      return image;
    }
    return assets[image];
  };

  /* ================= ADD TO CART ================= */
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

  /* ================= FILTER PRODUCTS ================= */
  const filteredProducts = products.filter((item) => {
    const text = search.toLowerCase();
    return (
      (category === "All" || item.category === category) &&
      (item.name.toLowerCase().includes(text) ||
        item.category.toLowerCase().includes(text))
    );
  });

  return (
    <div className="bg-black text-white px-6 sm:px-20 py-16 min-h-screen">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center mb-6">
        OUR <span className="text-red-600">COLLECTION</span>
      </h1>

      {/* SEARCH */}
      <div className="max-w-md mx-auto mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-black border border-gray-600 outline-none"
          placeholder="Search products..."
        />
      </div>

      {/* 🔥 DYNAMIC CATEGORY BUTTONS */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 border ${
              category === cat
                ? "bg-red-600 border-red-600"
                : "border-gray-600 hover:border-red-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-400 col-span-full">
            No products found
          </p>
        ) : (
          filteredProducts.map((item) => (
            <div
              key={item.id}
              className="bg-[#111] border border-gray-700 rounded-lg overflow-hidden"
            >
              <div
                onClick={() => navigate(`/product/${item.id}`)}
                className="h-56 flex items-center justify-center p-4 cursor-pointer"
              >
                <img
                  src={getImageSrc(item.image)}
                  alt={item.name}
                  className="h-full object-contain"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold mb-1">{item.name}</h3>

                <p className="text-red-500 font-semibold">
                  ₹{item.price}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 border border-red-600 text-red-500 py-2 hover:bg-red-600 hover:text-white transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleBuyNow(item)}
                    className="flex-1 bg-red-600 py-2 hover:bg-red-700 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Collection;
