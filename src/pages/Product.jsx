import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Product = () => {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  const { user, cart, setCart } = useContext(shopContext);
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= IMAGE HANDLER ================= */
  const getImageSrc = (image) => {
    if (!image) return "";

    // New products (URL or uploaded image)
    if (image.startsWith("http") || image.startsWith("/")) {
      return image;
    }

    // Old products (assets)
    return assets[image];
  };

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.sizes?.length) {
          setSelectedSize(res.data.sizes[0]);
        }
      })
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  /* ================= LIVE STOCK ================= */
  const remainingStock = useMemo(() => {
    if (!product) return 0;
    return product.stock - qty < 0 ? 0 : product.stock - qty;
  }, [product, qty]);

  /* ================= ADD TO CART ================= */
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

    let updatedCart = [...cart];

    const index = updatedCart.findIndex(
      (item) =>
        item.id === product.id &&
        (product.sizes ? item.size === selectedSize : true)
    );

    if (index !== -1) {
      const newQty = updatedCart[index].quantity + qty;
      if (newQty > product.stock) {
        toast.error("Stock exceeded");
        return;
      }
      updatedCart[index].quantity = newQty;
    } else {
      updatedCart.push({
        ...product,
        quantity: qty,
        size: product.sizes ? selectedSize : null,
      });
    }

    setCart(updatedCart);

    try {
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        cart: updatedCart,
      });
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to sync cart");
    }
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  if (!product) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 sm:px-20 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src={getImageSrc(product.image)}
            alt={product.name}
            className="w-full max-w-[420px] object-contain rounded-xl shadow-xl"
          />
        </div>

        {/* PRODUCT INFO */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-gray-400 mb-4 text-lg">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-4">
            <p className="text-3xl text-red-500 font-bold">
              ₹{product.price}
            </p>
            <p className="line-through text-gray-500">
              ₹{product.old_price}
            </p>
          </div>

          {/* STOCK */}
          <p className="text-sm text-gray-400 mb-6">
            Available Stock:{" "}
            <span
              className={
                remainingStock <= 3
                  ? "text-yellow-500 font-bold"
                  : "text-green-500 font-bold"
              }
            >
              {product.stock}
            </span>
          </p>

          {/* SIZE */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="font-semibold mb-2">Select Size:</p>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border ${
                      selectedSize === size
                        ? "bg-red-600 border-red-600"
                        : "border-gray-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Quantity:</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                className="px-4 py-2 bg-gray-700"
              >
                −
              </button>

              <p className="text-lg font-semibold">{qty}</p>

              <button
                onClick={() => {
                  if (qty < product.stock) setQty(qty + 1);
                }}
                className="px-4 py-2 bg-gray-700"
              >
                +
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`border px-8 py-3 transition ${
                product.stock === 0
                  ? "border-gray-600 text-gray-500 cursor-not-allowed"
                  : "border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className={`px-8 py-3 transition ${
                product.stock === 0
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
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
