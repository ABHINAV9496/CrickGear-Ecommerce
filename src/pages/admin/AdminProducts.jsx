import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editProduct, setEditProduct] = useState(null);

  const API = "http://localhost:5000/products";

  const loadProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);

      
      const cats = [...new Set(res.data.map((p) => p.category))];
      setCategories(cats);
    } catch (e) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  
  const getImageSrc = (img) => {
    if (!img) return "";
    if (assets[img]) return assets[img]; // asset key
    return img; // URL
  };

  
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    old_price: "",
    stock: "",
    image: "",
    description: "",
    sizes: "",
  });

  const handleAddChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      return toast.error("Name, Price & Category are required");
    }

    const productToAdd = {
      ...newProduct,
      id: Date.now().toString(),
      price: Number(newProduct.price),
      old_price: Number(newProduct.old_price),
      stock: Number(newProduct.stock),
      sizes:
        newProduct.category === "Jerseys" || newProduct.category === "Shoes"
          ? newProduct.sizes
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
    };

    try {
      await axios.post(API, productToAdd);
      toast.success("Product Added!");
      setShowAddModal(false);
      loadProducts();
    } catch (e) {
      toast.error("Failed to add product");
    }
  };

  
  const deleteProduct = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="mb-3 font-semibold text-red-500">
            Are you sure you want to delete this product?
          </p>

          <button
            className="bg-red-600 px-4 py-1 mr-3"
            onClick={async () => {
              try {
                await axios.delete(`${API}/${id}`);
                toast.success("Product deleted");
                loadProducts();
                closeToast();
              } catch {
                toast.error("Failed to delete");
              }
            }}
          >
            Yes
          </button>

          <button className="bg-gray-600 px-4 py-1" onClick={closeToast}>
            No
          </button>
        </div>
      ),
      { autoClose: false }
    );
  };

  
  const openEdit = (p) => {
    setEditProduct({
      ...p,
      sizes: p.sizes ? p.sizes.join(", ") : "",
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const saveEditProduct = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="mb-3 font-semibold text-red-500">
            Save changes to this product?
          </p>

          <button
            className="bg-green-600 px-4 py-1 mr-3"
            onClick={async () => {
              try {
                const updated = {
                  ...editProduct,
                  price: Number(editProduct.price),
                  old_price: Number(editProduct.old_price),
                  stock: Number(editProduct.stock),
                  sizes:
                    editProduct.category === "Jerseys" ||
                    editProduct.category === "Shoes"
                      ? editProduct.sizes
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : undefined,
                };

                await axios.patch(`${API}/${editProduct.id}`, updated);

                toast.success("Product updated!");
                loadProducts();
                setShowEditModal(false);
                closeToast();
              } catch (e) {
                toast.error("Failed to update");
              }
            }}
          >
            Yes
          </button>

          <button className="bg-gray-600 px-4 py-1" onClick={closeToast}>
            No
          </button>
        </div>
      ),
      { autoClose: false }
    );
  };


  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      filterCategory === "All" ? true : p.category === filterCategory
    )
    .sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      if (sortOption === "priceLow") return a.price - b.price;
      if (sortOption === "priceHigh") return b.price - a.price;
      if (sortOption === "stockLow") return a.stock - b.stock;
      if (sortOption === "stockHigh") return b.stock - a.stock;
      return 0;
    });


  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold tracking-wider uppercase">Products Manifest</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded text-sm font-semibold uppercase tracking-widest transition-colors shadow-lg shadow-red-600/20"
        >
          + New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
           <input
             className="w-full bg-[#0a0a0a] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors placeholder:text-gray-600 text-white"
             placeholder="Search product..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>

        <select
          className="w-full bg-[#0a0a0a] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-gray-300"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option>All Categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="w-full bg-[#0a0a0a] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-gray-300"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="name">Name (A-Z)</option>
          <option value="priceLow">Price (Low → High)</option>
          <option value="priceHigh">Price (High → Low)</option>
          <option value="stockLow">Stock (Low → High)</option>
          <option value="stockHigh">Stock (High → Low)</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-colors p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <div className="w-24 h-24 shrink-0 bg-[#111] rounded overflow-hidden flex items-center justify-center">
              <img
                src={getImageSrc(p.image)}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="font-bold text-lg text-gray-200">{p.name}</p>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{p.category}</p>

              <div className="flex items-center gap-4">
                <p className="text-red-500 font-bold">
                  ₹{p.price}{" "}
                  <span className="text-gray-600 line-through ml-2 font-medium">₹{p.old_price}</span>
                </p>
                <div className="w-px h-4 bg-gray-800"></div>
                <p className="text-gray-400 text-sm">Stock: <span className="text-white font-semibold">{p.stock}</span></p>
              </div>
            </div>
            
            <div className="w-full sm:w-auto h-px sm:h-auto sm:w-px bg-gray-800 self-stretch my-2 sm:my-0"></div>

            <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
              <button
                className="flex-1 sm:flex-none border border-gray-600 text-gray-300 hover:text-white hover:border-white px-6 py-2 rounded text-xs font-medium transition-colors"
                onClick={() => openEdit(p)}
              >
                EDIT
              </button>
              <button
                className="flex-1 sm:flex-none border border-red-800 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2 rounded text-xs font-medium transition-colors"
                onClick={() => deleteProduct(p.id)}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-[#0a0a0a] border border-gray-800 rounded-lg">
             <p className="text-gray-500">No products found matching filters.</p>
          </div>
        )}
      </div>

      
      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#0a0a0a] p-8 border border-gray-800 rounded-xl w-full max-w-xl shadow-2xl animate-fade-in-up">
            <h2 className="text-xl font-bold tracking-wider mb-6 border-b border-gray-800 pb-2">ADD NEW PRODUCT</h2>

            <div className="space-y-4">
              <input
                name="name"
                className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
                placeholder="Product Name"
                onChange={handleAddChange}
              />
              <input
                name="category"
                className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
                placeholder="Category (e.g., Bats, Shoes)"
                onChange={handleAddChange}
              />

              <div className="flex gap-4">
                <input
                  name="price"
                  className="w-1/2 bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
                  placeholder="New Price"
                  onChange={handleAddChange}
                />
                <input
                  name="old_price"
                  className="w-1/2 bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
                  placeholder="Old Price"
                  onChange={handleAddChange}
                />
              </div>

              <input
                name="stock"
                className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
                placeholder="Stock"
                onChange={handleAddChange}
              />

              <input
                name="image"
                className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
                placeholder="Image URL or asset key (bat1, shoes3...)"
                onChange={handleAddChange}
              />

              <textarea
                name="description"
                className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white resize-none"
                placeholder="Description"
                rows="3"
                onChange={handleAddChange}
              />

              {(newProduct.category === "Jerseys" ||
                newProduct.category === "Shoes") && (
                <input
                  name="sizes"
                  className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
                  placeholder="Sizes (comma separated)"
                  onChange={handleAddChange}
                />
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 mt-2">
                <button
                  className="border border-gray-600 text-gray-300 hover:text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-red-600/20"
                  onClick={addProduct}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {showEditModal && editProduct && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#0a0a0a] p-8 border border-gray-800 rounded-xl w-full max-w-xl shadow-2xl animate-fade-in-up">
            <h2 className="text-xl font-bold tracking-wider mb-6 border-b border-gray-800 pb-2">EDIT PRODUCT</h2>

            <div className="space-y-4">
              <input
                name="name"
                value={editProduct.name}
                onChange={handleEditChange}
                className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
              />
              <input
                name="category"
                value={editProduct.category}
                onChange={handleEditChange}
                className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
              />

              <div className="flex gap-4">
                <input
                  name="price"
                  value={editProduct.price}
                  onChange={handleEditChange}
                  className="w-1/2 bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
                />
                <input
                  name="old_price"
                  value={editProduct.old_price}
                  onChange={handleEditChange}
                  className="w-1/2 bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
                />
              </div>

              <input
                name="stock"
                value={editProduct.stock}
                onChange={handleEditChange}
                className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
              />

              <input
                name="image"
                value={editProduct.image}
                onChange={handleEditChange}
                className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
              />

              <textarea
                name="description"
                value={editProduct.description}
                onChange={handleEditChange}
                rows="3"
                className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white resize-none"
              />

              {(editProduct.category === "Jerseys" ||
                editProduct.category === "Shoes") && (
                <input
                  name="sizes"
                  value={editProduct.sizes}
                  onChange={handleEditChange}
                  className="w-full bg-[#111] border border-gray-800 px-4 py-3 rounded text-sm focus:border-red-600 focus:outline-none transition-colors text-white"
                />
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 mt-2">
                <button
                  className="border border-gray-600 text-gray-300 hover:text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-red-600/20"
                  onClick={saveEditProduct}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
