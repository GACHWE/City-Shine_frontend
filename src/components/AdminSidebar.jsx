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
  FiLogOut,
  FiUser,
  FiTag,
} from "react-icons/fi";
import { logOut } from "../utils/jwt-helper";
import DarkMode from "./Darkmode/DarkMode";

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

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const SidebarLinks = ({ onLinkClick }) => (
    <ul className="space-y-2">
      {navigation.map(({ name, path, icon: Icon }) => (
        <li key={name}>
          <NavLink
            to={path}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <Icon className="text-lg" />
            <span>{name}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  const BottomActions = ({ isMobile }) => (
    <div
      className={`flex items-center justify-between ${
        isMobile ? "absolute bottom-0 left-0 w-full p-4" : "p-4 border-t"
      } border-gray-200 dark:border-gray-700`}
    >
      {isMobile ? (
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>
      ) : (
        <DarkMode theme={theme} setTheme={setTheme} />
      )}
      <div className="flex gap-2 text-gray-600 dark:text-gray-400">
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FiLogOut />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiUser />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 fixed top-0 left-0 h-screen overflow-y-auto z-50">
        <div className="flex items-center justify-between p-6">
          <NavLink to="/admin">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <span className="text-blue-600">Admin</span>Panel
            </h1>
          </NavLink>
        </div>
        <nav className="flex-1 px-4 py-6">
          <SidebarLinks />
        </nav>
        <BottomActions />
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <NavLink to="/admin">
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
          <SidebarLinks onLinkClick={() => setSidebarOpen(false)} />
        </nav>
        <BottomActions isMobile />
      </aside>
    </>
  );
};

export default Sidebar;
