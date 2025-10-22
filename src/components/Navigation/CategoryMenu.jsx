import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaThLarge } from "react-icons/fa";

export default function MegaMenu({ title = "Categories", menuList = [] }) {
  const [menuOpen, setMenuOpen] = useState(false); // main menu toggle
  const [openCategory, setOpenCategory] = useState(null); // open subcategory
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    // Close menus
    setMenuOpen(false);
    setOpenCategory(null);
    // Navigate to product listing page with category ID
    navigate(`/category/${categoryId}`);
  };

  const toggleCategory = (categoryId) => {
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center gap-2 cursor-pointer hover:dark:text-purple-400 hover:text-purple-600 transition-colors font-medium"
      >
        <FaThLarge size={18} />
        {title}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute left-0 mt-2 w-60 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
          <ul>
            {menuList.map((cat) => (
              <li key={cat.id} className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center px-4 py-2">
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="text-left w-full hover:text-purple-700"
                  >
                    {cat.name}
                  </button>

                  {cat.subcategories?.length > 0 && (
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {openCategory === cat.id ? "−" : "+"}
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {cat.subcategories?.length > 0 && openCategory === cat.id && (
                  <ul className="pl-6 bg-gray-50 dark:bg-gray-700">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => handleCategoryClick(sub.id)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
