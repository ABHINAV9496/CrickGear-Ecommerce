import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart, user, logout } = useContext(shopContext); // get logout from context
  const [open, setOpen]             = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Total number of items in cart (sum of all quantities)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout(); // clears tokens + cart + user from context
    toast.success("Logged out successfully");
    navigate("/login");
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between py-6 bg-black text-white px-6 sm:px-20 relative">

      {/* Logo */}
      <img
        src={assets.logo}
        className="w-40 cursor-pointer"
        alt="logo"
        onClick={() => navigate("/")}
      />

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex gap-10 text-base">
        <NavLink to="/"           className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Home</NavLink>
        <NavLink to="/collection" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Collection</NavLink>
        <NavLink to="/about"      className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>About</NavLink>
        <NavLink to="/contact"    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>Contact</NavLink>
      </ul>

      {/* Right side icons */}
      <div className="flex items-center gap-7 relative">

        {/* Profile dropdown */}
        <div className="relative">
          <img
            src={assets.profile}
            className="w-7 invert cursor-pointer"
            onClick={() => setOpen(!open)}
            alt="profile"
          />

          {open && (
            <div className="absolute right-0 mt-3 sm:mt-4 z-50 w-48 shadow-2xl">
              <div className="bg-[#0a0a0a] border border-gray-800 rounded flex flex-col text-sm py-2 animate-fade-in-up origin-top-right">

                {user ? (
                  // ── Logged in: show username, profile, orders, logout ──
                  <>
                    {/* Show the logged-in username */}
                    <div className="px-5 py-2 border-b border-gray-800 mb-1">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-white font-semibold text-sm truncate">
                        {user.username}
                      </p>
                    </div>

                    <button
                      onClick={() => { navigate("/profile"); setOpen(false); }}
                      className="px-5 py-2.5 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                    >
                      My Profile
                    </button>

                    <button
                      onClick={() => { navigate("/orders"); setOpen(false); }}
                      className="px-5 py-2.5 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                    >
                      My Orders
                    </button>

                    <div className="h-px bg-gray-800 my-1 mx-2"></div>

                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 text-left text-red-500 hover:text-red-400 hover:bg-gray-800/50 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  // ── Not logged in: show login button ──
                  <button
                    onClick={() => { navigate("/login"); setOpen(false); }}
                    className="px-5 py-2.5 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                  >
                    Login / Register
                  </button>
                )}

              </div>
            </div>
          )}
        </div>

        {/* Cart icon with item count badge */}
        <Link to="/cart" className="relative cursor-pointer">
          <img src={assets.cart} className="w-6 invert" alt="cart" />
          {cartCount > 0 && (
            <span className="absolute -right-2 -bottom-2 bg-red-600 text-[10px] px-1.5 py-0.5 rounded-full text-white font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Mobile hamburger menu */}
        <img
          src={assets.menuicon}
          onClick={() => setMobileOpen(true)}
          className="w-6 invert cursor-pointer md:hidden"
          alt="menu"
        />
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed top-0 right-0 bottom-0 bg-black text-white transition-all duration-300 z-50 ${mobileOpen ? "w-full" : "w-0 overflow-hidden"}`}>
        <div className="flex flex-col text-lg">

          <div onClick={() => setMobileOpen(false)} className="flex items-center gap-4 p-5 cursor-pointer">
            <img className="h-5 rotate-180 invert" src={assets.menuicon} alt="back" />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setMobileOpen(false)} className="py-4 px-6 hover:text-red-500" to="/">HOME</NavLink>
          <NavLink onClick={() => setMobileOpen(false)} className="py-4 px-6 hover:text-red-500" to="/collection">COLLECTION</NavLink>
          <NavLink onClick={() => setMobileOpen(false)} className="py-4 px-6 hover:text-red-500" to="/about">ABOUT</NavLink>
          <NavLink onClick={() => setMobileOpen(false)} className="py-4 px-6 hover:text-red-500" to="/contact">CONTACT</NavLink>
          <NavLink onClick={() => setMobileOpen(false)} className="py-4 px-6 hover:text-red-500" to="/cart">CART</NavLink>

          {/* Mobile login/logout */}
          {user ? (
            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="py-4 px-6 text-left text-red-500 hover:text-red-400">
              LOGOUT
            </button>
          ) : (
            <NavLink onClick={() => setMobileOpen(false)} className="py-4 px-6 hover:text-red-500" to="/login">LOGIN</NavLink>
          )}

        </div>
      </div>

    </div>
  );
};

export default Navbar;