import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import DarkMode from "../Darkmode/DarkMode";
import { getAllCategories } from "../../api/fetchCategories";
import { countCartItems } from "../../store/features/cart";
import Logo from "../../assets/img/Logo.webp";
import SearchComponent from "../Search/SearchComponent";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

export default function Navigation() {
  const navigate = useNavigate();
  const cartLength = useSelector(countCartItems);

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <>
      <div className=" sticky top-0 z-50">
        {/* --- Top Nav --- */}
        <nav className="sticky top-0 z-50  bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
            <Link to="/about">
              <div className="flex items-center gap-2 font-bold  text-blue-400 whitespace-nowrap">
                <img
                  src={Logo}
                  alt="CITY-SHINE Logo"
                  className="w-30 h-16 sm:w rounded-sm"
                />
                <h3 className="hidden md:block">CITYSHINE</h3>
              </div>
            </Link>

            {/* Middle: Search (applies to ALL screen sizes) */}
            <div className="flex-1 mx-4 flex justify-center">
              
              <SearchComponent />
            </div>
            <div className="lg:hidden">
              <DarkMode />
            </div>

            {/* Right: Icons (only visible on lg and above) */}
            <div className="hidden lg:flex items-center gap-4">
              <DarkMode />

              <Link to="/cart-items" className="relative">
                <MdOutlineShoppingCart size={25} className=""/>
                {cartLength > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {cartLength}
                  </span>
                )}
              </Link>
              <Link to="/account-details/profile">
                <FaRegUser size={25}/>
              </Link>
            </div>
          </div>
        </nav>

        {/* --- Categories row --- */}
        <div className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-sm sticky top-[56px] z-40">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 overflow-x-auto py-2 scrollbar-hide">
              {/* All Categories button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 
                         hover:bg-blue-600 hover:text-white text-sm font-medium 
                         text-gray-700 dark:text-gray-300 transition"
              >
                <HiOutlineMenuAlt2 className="h-4 w-4" />
                All Categories
              </button>
              <Link
                to="/"
                className="flex-shrink-0 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 
                           hover:bg-blue-500 hover:text-white text-sm font-medium 
                           text-gray-700 dark:text-gray-300 transition"
              >
                Home
              </Link>
              {/* Quick categories */}
              {categories.slice(0, 7).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products/${cat.id}`)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 
                           hover:bg-blue-500 hover:text-white text-sm font-medium 
                           text-gray-700 dark:text-gray-300 transition"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- Sidebar for All Categories --- */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className="relative w-72 bg-white dark:bg-gray-900 h-full shadow-xl p-4 overflow-y-auto">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                <FiX className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-semibold mb-4">All Categories</h2>
              <ul className="space-y-2">
                {" "}
                <Link to="/categories" className="px-3 hover:bg-blue-100 dark:hover:bg-blue-700">
                  Browse All Categories
                </Link>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        navigate(`/products/${cat.id}`);
                        setSidebarOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-700"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
