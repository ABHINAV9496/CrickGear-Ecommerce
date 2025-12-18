import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart, user, setUser } = useContext(shopContext);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

 
  const adminToken = localStorage.getItem("admin_token");

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
    setOpen(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admin_token");
    toast.info("Admin logged out");
    navigate("/admin-login");
    setOpen(false);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="flex items-center justify-between py-6 bg-black text-white px-6 sm:px-20 relative">

      
      <img
        src={assets.logo}
        className="w-40 cursor-pointer"
        alt="logo"
        onClick={() => navigate("/")}
      />

      <ul className="hidden md:flex gap-10 text-base">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Home</NavLink>
        <NavLink to="/collection" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Collection</NavLink>
        <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Contact</NavLink>
      </ul>

      <div className="flex items-center gap-7 relative">

        
        {!user && !adminToken && (
          <p
            className="cursor-pointer hover:text-red-500 text-sm"
            onClick={() => navigate("/admin-login")}
          >
            Admin
          </p>
        )}

       
        {adminToken && (
          <p
            className="cursor-pointer hover:text-red-500 text-sm"
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </p>
        )}

        
        <div className="relative">
          <img
            src={assets.profile}
            className="w-7 invert cursor-pointer"
            onClick={() => setOpen(!open)}
            alt="profile"
          />

          {open && (
            <div className="absolute right-0 mt-4 z-50">
              <div className="bg-black border border-red-600 px-8 py-6 min-w-[180px] text-sm space-y-3 rounded">

                {user ? (
                  <>
                    <p
                      onClick={() => { navigate("/profile"); setOpen(false); }}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      My Profile
                    </p>

                    <p
                      onClick={() => { navigate("/orders"); setOpen(false); }}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      Orders
                    </p>

                    <p onClick={handleLogout} className="hover:text-red-500 cursor-pointer">
                      Logout
                    </p>
                  </>
                ) : (
                  <p
                    onClick={() => { navigate("/login"); setOpen(false); }}
                    className="hover:text-red-500 cursor-pointer"
                  >
                    Login
                  </p>
                )}

              
                {adminToken && (
                  <p
                    onClick={handleAdminLogout}
                    className="cursor-pointer hover:text-red-500"
                  >
                    Admin Logout
                  </p>
                )}

              </div>
            </div>
          )}
        </div>

        
        <Link to="/cart" className="relative cursor-pointer">
          <img src={assets.cart} className="w-6 invert" alt="cart" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -bottom-2 bg-red-600 text-[10px] px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        
        <img
          src={assets.menuicon}
          onClick={() => setMobileOpen(true)}
          className="w-6 invert cursor-pointer md:hidden"
          alt="menu"
        />
      </div>

      <div
        className={`fixed top-0 right-0 bottom-0 bg-black text-white transition-all duration-300 z-50 ${
          mobileOpen ? "w-full" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col text-lg">

          <div
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-4 p-5 cursor-pointer"
          >
            <img className="h-5 rotate-180 invert" src={assets.menuicon} alt="back" />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setMobileOpen(false)} className="py-4 px-6 hover:text-red-500" to="/">HOME</NavLink>
          <NavLink onClick={() => setMobileOpen(false)} className="py-4 px-6 hover:text-red-500" to="/collection">COLLECTION</NavLink>
          <NavLink onClick={() => setMobileOpen(false)} className="py-4 px-6 hover:text-red-500" to="/about">ABOUT</NavLink>
          <NavLink onClick={() => setMobileOpen(false)} className="py-4 px-6 hover:text-red-500" to="/contact">CONTACT</NavLink>
          <NavLink onClick={() => setMobileOpen(false)} className="py-4 px-6 hover:text-red-500" to="/cart">CART</NavLink>

        </div>
      </div>

    </div>
  );
};

export default Navbar;
