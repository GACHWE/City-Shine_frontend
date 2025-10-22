import React, { useCallback, useEffect, useState } from "react";
import { logOut } from "../../utils/jwt-helper";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { fetchUserDetails } from "../../api/userInfo";
import {
  loadUserInfo,
  selectIsUserAdmin,
  selectUserInfo,
} from "../../store/features/user";
import { FaUser, FaShoppingBag, FaCog, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const isUserAdmin = useSelector(selectIsUserAdmin);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = useCallback(() => {
    logOut();
    navigate("/");
  }, [navigate]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    dispatch(setLoading(true));
    fetchUserDetails()
      .then((res) => {
        dispatch(loadUserInfo(res));
      })
      .catch((err) => {
        console.error("Failed to fetch user details:", err);
        setError("Unable to load account details.");
        navigate("/login");
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch, navigate]);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-lg p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</p>
    </div>;
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
          <p>Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Hello, {userInfo?.firstName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to your account dashboard
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {isUserAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
              >
                Admin Panel
              </Link>
            )}
            {/* <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-fit">
            <nav>
              <ul className="space-y-2">
                <li>
                  <NavLink
                    to="profile"
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaUser className="w-5 h-5 mr-3" />
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="orders"
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaShoppingBag className="w-5 h-5 mr-3" />
                    Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="settings"
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <FaCog className="w-5 h-5 mr-3" />
                    Settings
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <FaSignOutAlt className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;