// src/components/Navigation/BottomNav.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { FaHome, FaShoppingCart, FaUser, FaUserAlt } from "react-icons/fa";
import { AiOutlineAppstore } from "react-icons/ai";
import { countCartItems } from "../../store/features/cart";
import { AccountIcon } from "../common/AccountIcon";

export default function BottomNav() {
  const cartLength = useSelector(countCartItems);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down → hide
        setIsVisible(false);
      } else {
        // scrolling up → show
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const getNavClass = ({ isActive }) => {
    const base =
      "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all";
    const active = "text-blue-400 font-semibold";
    const inactive = "text-gray-500 dark:text-gray-400 hover:text-blue-500";
    return `${base} ${isActive ? active : inactive}`;
  };

  return (
    <nav
      className={`fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-md lg:hidden 
      bg-[#f7f6f0] dark:bg-gray-900 text-gray-900 dark:text-white 
      border border-gray-200 dark:border-gray-700 
      shadow-lg rounded-2xl z-50 transition-transform duration-300
      ${isVisible ? "translate-y-0" : "translate-y-24"}`}
    >
      <ul className="flex justify-around items-center py-2 text-xs">
        {/* Home */}
        <li>
          <NavLink to="/" className={getNavClass}>
            <FaHome size={22} />
            <span>Home</span>
          </NavLink>
        </li>

        {/* Categories */}
        <li>
          <NavLink to="/categories" className={getNavClass}>
            <AiOutlineAppstore size={22} />
            <span>Categories</span>
          </NavLink>
        </li>

        {/* Cart */}
        <li>
          <NavLink to="/cart-items" className={getNavClass}>
            <FaShoppingCart size={22} />
            <span className="text-xs mt-1">Cart</span>
            {cartLength > 0 && (
              <span className="absolute top-0 right-36 min-w-[18px]  h-5 
                bg-red-500 text-white rounded-full 
                text-[10px] flex items-center justify-center shadow-md">
                {cartLength}
              </span>
            )}
          </NavLink>
        </li>

        {/* Profile */}
        <li>
          <NavLink to="/account-details/profile" className={getNavClass}>
            <FaUserAlt size={22}/>
            <span>Account</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
