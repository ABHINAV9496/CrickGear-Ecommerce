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

  
  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        setProducts(res.data);

        
        const uniqueCategories = [
          "All",
          ...new Set(res.data.map((p) => p.category)),
        ];

        setCategories(uniqueCategories);
      })
      .catch(() => toast.error("Failed to load products"));
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

  
  const filteredProducts = products.filter((item) => {
    const text = search.toLowerCase();
    return (
      (category === "All" || item.category === category) &&
      (item.name.toLowerCase().includes(text) ||
        item.category.toLowerCase().includes(text))
    );
  });

  return (
    <div className="text-white py-10 relative z-10 w-full animate-fade-in-up">
      {/* Title */}
      <div className="mb-10 sm:mb-14 text-center sm:text-left">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          OUR <span className="text-red-600">COLLECTION</span>
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl text-sm sm:text-base">
          Browse our premium selection of gear. Filter by category or search to find exactly what you need.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="bg-[#111]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:sticky md:top-24 shadow-lg">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              Filters
            </h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Search Products</label>
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-700 focus:border-red-600 focus:ring-1 focus:ring-red-600/50 rounded-xl outline-none transition-all text-sm placeholder-gray-500"
                  placeholder="Search..."
                />
                <svg className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Category</label>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between ${
                      category === cat
                        ? "bg-red-600/10 text-red-500 border border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                        : "bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent"
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && <span className="w-2 h-2 rounded-full bg-red-600"></span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 bg-[#111]/50 rounded-2xl border border-gray-800 border-dashed">
                <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm mt-1">Try adjusting your category or search filters.</p>
              </div>
            ) : (
              filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-red-600/50 hover:shadow-[0_8px_30px_rgb(220,38,38,0.12)] transition-all duration-400 transform hover:-translate-y-1.5 flex flex-col"
                >
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
                  
                  {/* Image Wrapper - Background explicitly white so product photos with white background blend perfectly */}
                  <div
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="h-56 sm:h-64 bg-white flex items-center justify-center p-6 cursor-pointer relative overflow-hidden"
                  >
                    <img
                      src={getImageSrc(item.image)}
                      alt={item.name}
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                    />
                  </div>

                  <div className="p-5 flex flex-col grow">
                    <div className="mb-4 grow">
                      <p className="text-xs text-gray-500 tracking-widest uppercase font-semibold mb-1">{item.category}</p>
                      <h3 className="font-bold text-lg leading-snug line-clamp-2 text-gray-100 group-hover:text-red-400 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-red-500 font-extrabold text-xl mt-2 tracking-tight">
                        ₹{item.price}
                      </p>
                    </div>

                    <div className="flex gap-2.5 mt-auto relative z-20">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-[#1a1a1a] border border-gray-700 text-gray-300 rounded-xl py-2.5 text-sm font-bold hover:bg-red-600/10 hover:border-red-600 hover:text-red-500 transition-all duration-300"
                      >
                        Add to Cart
                      </button>

                      <button
                        onClick={() => handleBuyNow(item)}
                        className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-red-500 shadow-[0_4px_10px_rgba(220,38,38,0.2)] hover:shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all duration-300"
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
      </div>
    </div>
  );
};

export default Collection;
