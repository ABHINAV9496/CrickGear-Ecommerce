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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 px-4 py-2"
        >
          + Add Product
        </button>
      </div>

      
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          className="bg-black border border-gray-600 px-3 py-2 rounded"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="bg-black border border-gray-600 px-3 py-2 rounded"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option>All</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="bg-black border border-gray-600 px-3 py-2 rounded"
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
            className="border border-gray-700 p-4 rounded flex items-center gap-6"
          >
            <img
              src={getImageSrc(p.image)}
              alt={p.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <p className="font-semibold text-lg">{p.name}</p>

              <p className="text-gray-400">{p.category}</p>

              <p className="text-red-500 font-semibold">
                ₹{p.price}{" "}
                <span className="text-gray-500 line-through ml-2">
                  ₹{p.old_price}
                </span>
              </p>

              <p className="text-gray-300">Stock: {p.stock}</p>
            </div>

            <button
              className="bg-blue-600 px-4 py-1 mr-3"
              onClick={() => openEdit(p)}
            >
              Edit
            </button>

            <button
              className="bg-red-600 px-4 py-1"
              onClick={() => deleteProduct(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-[#111] p-6 border border-red-600 rounded w-[90%] max-w-xl">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>

            <div className="space-y-3">

              <input
                name="name"
                className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
                placeholder="Product Name"
                onChange={handleAddChange}
              />

              <input
                name="category"
                className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
                placeholder="Category (e.g., Bats, Shoes)"
                onChange={handleAddChange}
              />

              <div className="flex gap-3">
                <input
                  name="price"
                  className="w-1/2 bg-black border border-gray-600 px-3 py-2 rounded"
                  placeholder="New Price"
                  onChange={handleAddChange}
                />
                <input
                  name="old_price"
                  className="w-1/2 bg-black border border-gray-600 px-3 py-2 rounded"
                  placeholder="Old Price"
                  onChange={handleAddChange}
                />
              </div>

              <input
                name="stock"
                className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
                placeholder="Stock"
                onChange={handleAddChange}
              />

              <input
                name="image"
                className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
                placeholder="Image URL or asset key (bat1, shoes3...)"
                onChange={handleAddChange}
              />

              <textarea
                name="description"
                className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
                placeholder="Description"
                onChange={handleAddChange}
              />

              {(newProduct.category === "Jerseys" ||
                newProduct.category === "Shoes") && (
                <input
                  name="sizes"
                  className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
                  placeholder="Sizes (comma separated)"
                  onChange={handleAddChange}
                />
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="bg-gray-600 px-4 py-2"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 px-4 py-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-[#111] p-6 border border-blue-600 rounded w-[90%] max-w-xl">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>

            <div className="space-y-3">

              <input
                name="name"
                value={editProduct.name}
                onChange={handleEditChange}
                className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
              />

              <input
                name="category"
                value={editProduct.category}
                onChange={handleEditChange}
                className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
              />

              <div className="flex gap-3">
                <input
                  name="price"
                  value={editProduct.price}
                  onChange={handleEditChange}
                  className="w-1/2 bg-black border border-gray-600 px-3 py-2 rounded"
                />
                <input
                  name="old_price"
                  value={editProduct.old_price}
                  onChange={handleEditChange}
                  className="w-1/2 bg-black border border-gray-600 px-3 py-2 rounded"
                />
              </div>

              <input
                name="stock"
                value={editProduct.stock}
                onChange={handleEditChange}
                className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
              />

              <input
                name="image"
                value={editProduct.image}
                onChange={handleEditChange}
                className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
              />

              <textarea
                name="description"
                value={editProduct.description}
                onChange={handleEditChange}
                className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
              />

              {(editProduct.category === "Jerseys" ||
                editProduct.category === "Shoes") && (
                <input
                  name="sizes"
                  value={editProduct.sizes}
                  onChange={handleEditChange}
                  className="w-full bg-black border border-gray-600 px-3 py-2 rounded"
                />
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="bg-gray-600 px-4 py-2"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="bg-green-600 px-4 py-2"
                  onClick={saveEditProduct}
                >
                  Save
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
