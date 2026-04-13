import React, { useEffect, useState, useContext, useCallback } from "react";
import api from "../api";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Collection = () => {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);

  // ── All filter state ──────────────────────────────────────
  const [category, setCategory] = useState("All");
  const [search, setSearch]     = useState("");
  const [sort, setSort]         = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // ── Pagination state ──────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalCount, setTotalCount]   = useState(0);
  const PRODUCTS_PER_PAGE = 6;

  const navigate            = useNavigate();
  const { user, cart, setCart } = useContext(shopContext);

  // ── Load categories once on mount ────────────────────────
  // Fetch all products once just to get category names
  useEffect(() => {
    api.get("/products/?limit=100")
      .then((res) => {
        const unique = [
          "All",
          ...new Set(res.data.results.map((p) => p.category)),
        ];
        setCategories(unique);
      })
      .catch(() => {});
  }, []);

  // ── Fetch products from Django whenever filters change ────
  // ALL filtering/searching/sorting/pagination is done by Django
  // React just sends the query params and displays results
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Send filters to Django backend
      if (category && category !== "All") params.append("category", category);
      if (search)   params.append("search",    search);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (sort)     params.append("sort",      sort);

      // Pagination params
      params.append("page",  currentPage);
      params.append("limit", PRODUCTS_PER_PAGE);

      // Django returns: { count: 27, next: "...", previous: null, results: [...] }
      const res = await api.get(`/products/?${params}`);

      setProducts(res.data.results);
      setTotalCount(res.data.count);
      setTotalPages(Math.ceil(res.data.count / PRODUCTS_PER_PAGE));
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [category, search, minPrice, maxPrice, sort, currentPage]);

  // ── Re-fetch when any filter or page changes ──────────────
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── When filter changes, reset to page 1 ─────────────────
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleMinPrice = (e) => {
    setMinPrice(e.target.value);
    setCurrentPage(1);
  };

  const handleMaxPrice = (e) => {
    setMaxPrice(e.target.value);
    setCurrentPage(1);
  };

  // ── Reset all filters ─────────────────────────────────────
  const handleReset = () => {
    setCategory("All");
    setSearch("");
    setSort("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  // ── Image helper ──────────────────────────────────────────
  const getImageSrc = (image) => {
    if (!image) return "";
    if (image.startsWith("http") || image.startsWith("/")) return image;
    return assets[image]; // maps "bat1" → local asset
  };

  // ── Add to cart (localStorage) ────────────────────────────
  const handleAddToCart = (product) => {
    if (!user?.id) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error("Stock limit reached!");
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        { ...product, quantity: 1, size: product.sizes?.[0] || null },
      ]);
    }
    toast.success("Added to cart!");
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    navigate("/cart");
  };

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

        {/* ── Sidebar ──────────────────────────────────────── */}
        <div className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="bg-[#111]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:sticky md:top-24 shadow-lg">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </h2>
              <button
                onClick={handleReset}
                className="text-xs text-red-500 hover:text-red-400 font-semibold uppercase tracking-wider"
              >
                Reset All
              </button>
            </div>

            {/* Search — sent to Django as ?search=bat */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-700 focus:border-red-600 rounded-xl outline-none transition-all text-sm placeholder-gray-500"
                  placeholder="Search..."
                />
                <svg className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category — sent to Django as ?category=Bats */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Category
              </label>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between ${
                      category === cat
                        ? "bg-red-600/10 text-red-500 border border-red-600/50"
                        : "bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent"
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && (
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range — sent to Django as ?min_price=500&max_price=5000 */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Price Range (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={handleMinPrice}
                  className="w-full px-3 py-2 bg-black/50 border border-gray-700 focus:border-red-600 rounded-xl outline-none text-sm placeholder-gray-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={handleMaxPrice}
                  className="w-full px-3 py-2 bg-black/50 border border-gray-700 focus:border-red-600 rounded-xl outline-none text-sm placeholder-gray-500"
                />
              </div>
            </div>

            {/* Sort — sent to Django as ?sort=price_low */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Sort By
              </label>
              <select
                value={sort}
                onChange={handleSortChange}
                className="w-full px-3 py-2.5 bg-black/50 border border-gray-700 focus:border-red-600 rounded-xl outline-none text-sm text-gray-300"
              >
                <option value="">Default</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

          </div>
        </div>

        {/* ── Products Grid ─────────────────────────────────── */}
        <div className="flex-1">

          {/* Results info */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              {loading
                ? "Loading..."
                : `${totalCount} product${totalCount !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {/* Loading skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-800"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-800 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-800 rounded"></div>
                    <div className="h-5 bg-gray-800 rounded w-1/4"></div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-10 bg-gray-800 rounded-xl flex-1"></div>
                      <div className="h-10 bg-gray-800 rounded-xl flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-[#111]/50 rounded-2xl border border-gray-800 border-dashed">
              <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters.</p>
              <button
                onClick={handleReset}
                className="mt-4 text-red-500 hover:text-red-400 text-sm font-semibold"
              >
                Reset Filters
              </button>
            </div>

          ) : (
            <>
              {/* Product cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-red-600/50 hover:shadow-[0_8px_30px_rgb(220,38,38,0.12)] transition-all duration-400 transform hover:-translate-y-1.5 flex flex-col"
                  >
                    <div
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="h-56 sm:h-64 bg-white flex items-center justify-center p-6 cursor-pointer overflow-hidden"
                    >
                      <img
                        src={getImageSrc(item.image)}
                        alt={item.name}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                      />
                    </div>

                    <div className="p-5 flex flex-col grow">
                      <div className="mb-4 grow">
                        <p className="text-xs text-gray-500 tracking-widest uppercase font-semibold mb-1">
                          {item.category}
                        </p>
                        <h3 className="font-bold text-lg leading-snug line-clamp-2 text-gray-100 group-hover:text-red-400 transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-red-500 font-extrabold text-xl tracking-tight">
                            ₹{item.price}
                          </p>
                          {item.old_price && (
                            <p className="text-gray-500 line-through text-sm">
                              ₹{item.old_price}
                            </p>
                          )}
                        </div>
                        {item.stock <= 5 && item.stock > 0 && (
                          <p className="text-yellow-500 text-xs mt-1 font-semibold">
                            Only {item.stock} left!
                          </p>
                        )}
                        {item.stock === 0 && (
                          <p className="text-red-500 text-xs mt-1 font-semibold">
                            Out of Stock
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2.5 mt-auto relative z-20">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock === 0}
                          className="flex-1 bg-[#1a1a1a] border border-gray-700 text-gray-300 rounded-xl py-2.5 text-sm font-bold hover:bg-red-600/10 hover:border-red-600 hover:text-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                        <button
                          onClick={() => handleBuyNow(item)}
                          disabled={item.stock === 0}
                          className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Pagination ──────────────────────────────── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">

                  {/* Prev */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:border-red-600 hover:text-red-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    ← Prev
                  </button>

                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                            currentPage === page
                              ? "bg-red-600 text-white border border-red-600"
                              : "border border-gray-700 text-gray-400 hover:border-red-600 hover:text-red-500"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-gray-600">...</span>;
                    }
                    return null;
                  })}

                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:border-red-600 hover:text-red-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Next →
                  </button>

                </div>
              )}

              {/* Page info */}
              {totalPages > 1 && (
                <p className="text-center text-xs text-gray-500 mt-3">
                  Page {currentPage} of {totalPages} — {totalCount} total products
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;