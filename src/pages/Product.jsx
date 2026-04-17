import React, { useEffect, useState, useContext, useMemo } from "react";
import api from "../api";
import { assets } from "../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Product = () => {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  const { user, addToCart } = useContext(shopContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const getImageSrc = (image) => {
    if (!image) return "";
    if (image.startsWith("http") || image.startsWith("/")) return image;
    return assets[image];
  };


  useEffect(() => {
    api.get(`/products/${id}/`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0]);
      })
      .catch(() => toast.error("Failed to load product"));
  }, [id]);


  const handleAddToCart = async () => {
    if (!user?.id) {
      toast.warn("Please login!");
      navigate("/login");
      return;
    }
    if (qty > product.stock) {
      toast.error("Cannot exceed available stock");
      return;
    }
    try {
      await addToCart(product, qty, product.sizes?.length ? selectedSize : "");
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  if (!product) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 sm:px-20 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">


        <div className="flex justify-center">
          <img
            src={getImageSrc(product.image)}
            alt={product.name}
            className="w-full max-w-[420px] object-contain rounded-xl shadow-xl"
          />
        </div>

        <div>
          <p className="text-xs text-gray-500 tracking-widest uppercase mb-2">{product.category}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-400 mb-4 text-lg">{product.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <p className="text-3xl text-red-500 font-bold">₹{product.price}</p>
            {product.old_price && (
              <p className="line-through text-gray-500 text-lg">₹{product.old_price}</p>
            )}
          </div>


          <p className="text-sm text-gray-400 mb-6">
            Available Stock:{" "}
            <span className={product.stock <= 3 ? "text-yellow-500 font-bold" : "text-green-500 font-bold"}>
              {product.stock}
            </span>
          </p>

          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="font-semibold mb-2">Select Size:</p>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded transition-colors ${selectedSize === size
                      ? "bg-red-600 border-red-600 text-white"
                      : "border-gray-600 text-gray-300 hover:border-red-600"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}


          <div className="mb-6">
            <p className="font-semibold mb-2">Quantity:</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >−</button>
              <p className="text-lg font-semibold w-6 text-center">{qty}</p>
              <button
                onClick={() => { if (qty < product.stock) setQty(qty + 1); }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >+</button>
            </div>
          </div>


          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`border px-8 py-3 rounded transition-colors ${product.stock === 0
                ? "border-gray-600 text-gray-500 cursor-not-allowed"
                : "border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                }`}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className={`px-8 py-3 rounded transition-colors ${product.stock === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
                }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;