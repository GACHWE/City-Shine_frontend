// src/components/Sidebar.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiSun,
  FiMoon,
  FiX,
  FiMenu,
  FiLogOut,
  FiUser,
  FiTag,
} from "react-icons/fi";
import { logOut } from "../utils/jwt-helper";

const navigation = [
  { name: "Dashboard", path: "/admin", icon: FiHome },
  { name: "Products", path: "/admin/products", icon: FiBox },
  { name: "Orders", path: "/admin/orders", icon: FiShoppingCart },
  { name: "Users", path: "/admin/users", icon: FiUsers },
  { name: "Categories", path: "/admin/categories", icon: FiTag },
  { name: "Settings", path: "/admin/settings", icon: FiSettings },
];

const Sidebar = ({ isSidebarOpen, setSidebarOpen, theme, setTheme }) => {
  const navigate = useNavigate();

  // FIX: Define the toggleTheme function here
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  return (
    <>
      {/* Sidebar for large screens */}
      <div
        className={`hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          fixed top-0 left-0 h-screen overflow-y-auto z-50 transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-6">
          <NavLink to="/admin" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <span className="text-blue-600">Admin</span>Panel
            </h1>
          </NavLink>
        </div>

        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    }`
                  }
                >
                  <item.icon className="text-lg" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
            <div className="text-gray-600 dark:text-gray-400">
              {/* Logout button for large screens */}
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={handleLogout}
              >
                <FiLogOut />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <FiUser />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for mobile screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 z-50
          transform transition-transform duration-300 lg:hidden
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <NavLink to="/admin" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <span className="text-blue-600">Admin</span>Panel
            </h1>
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <FiX className="text-2xl" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
  ${
    isActive
      ? "bg-blue-600 text-white shadow-md"
      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
  }`
}
                >
                  <item.icon className="text-lg" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              // FIX: This now correctly calls the defined toggleTheme function
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
            <div className="text-gray-600 dark:text-gray-400">
              {/* Logout button for mobile screens */}
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={handleLogout}
              >
                <FiLogOut />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <FiUser />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;