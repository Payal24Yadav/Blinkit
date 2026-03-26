import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiShoppingCart, FiUser, FiZap, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceRupees";
import { DisplayCartItem } from "./DisplayCartItem";

import { useGlobalContext } from "../provider/GlobalProvider";

const Header = () => {
  const location = useLocation(); // To close sidebar on navigation
  const user = useSelector((state) => state?.user);
  const {totalPrice, totalQty}= useGlobalContext()
  
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCartSection, setOpenCartSection] = useState(false);

  
  const menuRef = useRef(null);
  const token = localStorage.getItem("accesstoken");

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
 
  // Close sidebar if user navigates away
  useEffect(() => {
    setOpenCartSection(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-[100] w-full h-20 border-b border-stone-200 bg-[#FDFCF0]/90 backdrop-blur-md px-6">
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between gap-8">
        
        {/* BRAND */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <FiZap className="text-amber-500 text-2xl animate-pulse" />
          <span className="text-stone-900 font-black text-2xl tracking-tighter">
            BlinkIT<span className="text-amber-500">.</span>
          </span>
        </Link>

        {/* SEARCH */}
        <div className="flex-1 max-w-xl hidden md:block">
          <Search />
        </div>

        <div className="flex items-center gap-6 shrink-0">
          {/* USER SECTION */}
          {user?._id ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="flex items-center gap-1 text-stone-700 hover:text-amber-600 font-semibold p-2"
              >
                <FiUser size={20} />
                <span className="hidden sm:inline">Account</span>
                {openUserMenu ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-2xl rounded-xl border border-stone-100 overflow-hidden">
                  <UserMenu close={() => setOpenUserMenu(false)} />
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-stone-700 hover:text-amber-600 font-semibold">
              <FiUser size={20} />
              <span>Login</span>
            </Link>
          )}

          {/* CART TRIGGER BUTTON */}
          <button
            onClick={() => setOpenCartSection(true)}
            className="flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg transition-all shadow-md group"
          >
            <div className="relative border-r border-amber-400 pr-3">
              <FiShoppingCart className="text-xl group-hover:scale-110 transition-transform" />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-1 bg-amber-900 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-white">
                  {totalQty}
                </span>
              )}
            </div>

            <div className="flex flex-col text-left">
              {totalQty > 0 ? (
                <>
                  <span className="text-[10px] font-medium leading-none opacity-80 uppercase tracking-wider">My Cart</span>
                  <span className="text-sm font-bold leading-tight">
                    {DisplayPriceInRupees(totalPrice)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold">Cart</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* SIDEBAR CART */}
      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;