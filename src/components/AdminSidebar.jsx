import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiBox, FiShoppingCart, FiUsers, FiSettings, FiLogOut, FiUser, FiTag, FiX} from "react-icons/fi";
import { logOut } from "../utils/jwt-helper";

const navigation = [
  // { name: "Dashboard", path: "/admin", icon: FiHome },
  { name: "Products", path: "/admin/products", icon: FiBox },
  { name: "Orders", path: "/admin/orders", icon: FiShoppingCart },
  { name: "Offers", path: "/admin/feature-product", icon: FiUsers },
  { name: "Categories", path: "/admin/categories", icon: FiTag },
  // { name: "Settings", path: "/admin/settings", icon: FiSettings },
];

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
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
        
        {/* Bottom Actions for Desktop */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-gray-600 dark:text-gray-400">
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Logout"
              >
                <FiLogOut className="text-lg" />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Profile"
              >
                <FiUser className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <NavLink to="/admin" onClick={() => setSidebarOpen(false)}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <span className="text-blue-600">Admin</span>Panel
            </h1>
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 h-[calc(100vh-120px)] overflow-y-auto">
          <SidebarLinks onLinkClick={() => setSidebarOpen(false)} />
        </nav>

        {/* Bottom Actions for Mobile */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-gray-600 dark:text-gray-400">
              <button
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Logout"
              >
                <FiLogOut className="text-lg" />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Profile"
              >
                <FiUser className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;