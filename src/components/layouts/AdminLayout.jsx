import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../AdminSidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

const AdminHeader = ({ toggleSidebar, isSidebarOpen }) => (
  <div className="h-10 bg-white dark:bg-gray-800 shadow-sm flex items-center ">
    <button
      className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      onClick={toggleSidebar}
      aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {isSidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
    </button>
  </div>
);

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const setSidebarOpen = (open) => {
    setIsSidebarOpen(open);
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Sidebar Container */}
      <div className="flex">
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <div className=" flex flex-col md:ml-0  bg-gray-100 dark:bg-gray-900">
        <AdminHeader 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        className= "bg-yellow-200"
        />

        <main >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;