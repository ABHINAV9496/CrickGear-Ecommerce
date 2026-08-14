import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar      from "./components/Navbar";
import Footer      from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const Home           = lazy(() => import("./pages/Home"));
const Collection     = lazy(() => import("./pages/Collection"));
const About          = lazy(() => import("./pages/About"));
const Contact        = lazy(() => import("./pages/Contact"));
const Product        = lazy(() => import("./pages/Product"));
const Login          = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword  = lazy(() => import("./pages/ResetPassword"));
const Orders         = lazy(() => import("./pages/Orders"));
const Cart           = lazy(() => import("./pages/Cart"));
const Profile        = lazy(() => import("./pages/Profile"));
const Payment        = lazy(() => import("./pages/Payment"));

const Admin           = lazy(() => import("./pages/admin/Admin"));
const AdminDashboard  = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts   = lazy(() => import("./pages/admin/AdminProducts"));
const AdminUsers      = lazy(() => import("./pages/admin/AdminUsers"));
const AdminOrders     = lazy(() => import("./pages/admin/AdminOrders"));
const AdminOrderDetail = lazy(() => import("./pages/admin/AdminOrderDetail"));
const AdminProtected  = lazy(() => import("./pages/admin/AdminProtected"));
const ShopperProtected = lazy(() => import("./components/ShopperProtected"));
const NotFound        = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <p className="text-gray-400 animate-pulse">Loading...</p>
  </div>
);

const App = () => {
  return (
    <div className="relative overflow-hidden min-h-screen px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ScrollToTop />
      <Navbar />

      <Suspense fallback={<PageLoader />}>
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
            <Route path="users"    element={<AdminUsers />} />
            <Route path="orders"   element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
          </Route>

          {/* Fallback for any unknown URL */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

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
