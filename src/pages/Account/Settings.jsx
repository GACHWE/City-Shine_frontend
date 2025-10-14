import React, { useCallback } from 'react'
import { logOut } from '../../utils/jwt-helper';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBell, FaLanguage, FaShieldAlt } from 'react-icons/fa';

const Settings = () => {
  const navigate = useNavigate();

  const onLogOut = useCallback(() => {
    logOut();
    navigate("/");
  }, [navigate]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-4">
              <FaShieldAlt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Privacy & Security</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your privacy settings</p>
            </div>
          </div>
          <button className="w-full mt-2 px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
            Configure
          </button>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg mr-4">
              <FaSignOutAlt className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Logout</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account</p>
            </div>
          </div>
          <button
            onClick={onLogOut}
            className="w-full mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;