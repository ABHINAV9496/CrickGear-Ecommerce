import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home         from "./pages/Home";
import Collection   from "./pages/Collection";
import About        from "./pages/About";
import Contact      from "./pages/Contact";
import Product      from "./pages/Product";
import Login        from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Orders       from "./pages/Orders";
import Cart         from "./pages/Cart";
import Profile      from "./pages/Profile";
import Payment      from "./pages/Payment";
import Navbar       from "./components/Navbar";
import Footer       from "./components/Footer";
import ScrollToTop  from "./components/ScrollToTop";

import Admin          from "./pages/admin/Admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts  from "./pages/admin/AdminProducts";
import AdminUsers     from "./pages/admin/AdminUsers";
import AdminOrders    from "./pages/admin/AdminOrders";
import AdminProtected from "./pages/admin/AdminProtected";
import ShopperProtected from "./components/ShopperProtected";

const App = () => {
  return (
    <div className="relative overflow-hidden min-h-screen px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* User pages */}
        <Route path="/"           element={<Home />} />
        <Route path="/collection" element={<ShopperProtected><Collection /></ShopperProtected>} />
        <Route path="/about"      element={<About />} />
        <Route path="/contact"    element={<Contact />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart"       element={<ShopperProtected><Cart /></ShopperProtected>} />
        <Route path="/login"      element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/orders"     element={<ShopperProtected><Orders /></ShopperProtected>} />
        <Route path="/profile"    element={<ShopperProtected><Profile /></ShopperProtected>} />
        <Route path="/payment"    element={<ShopperProtected><Payment /></ShopperProtected>} />

        {/* Admin pages — protected, only admins can access */}
        <Route path="/admin" element={<AdminProtected><Admin /></AdminProtected>}>
          <Route index           element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users"    element={<AdminOrders />} />
          <Route path="orders"   element={<AdminOrders />} />
        </Route>
      </Routes>

      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
        toastStyle={{ backgroundColor: "#111", color: "#fff" }}
      />
    </div>
  );
};

export default App;