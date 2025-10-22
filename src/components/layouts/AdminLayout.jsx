import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../AdminSidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

// Placeholder AdminHeader component with responsive styling
const AdminHeader = ({ toggleSidebar, isSidebarOpen }) => (
  <div className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center px-4 sm:px-6 md:px-8">
    <button
      className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
      onClick={toggleSidebar}
      aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {isSidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
    </button>
    <div className="flex-1 text-center sm:text-left text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300">
      Admin Dashboard
    </div>
  </div>
);

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Sidebar: Hidden on mobile, visible on md and larger */}
     <div
  className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 ease-in-out ${
    isSidebarOpen ? 'block' : 'hidden'
  } md:block md:w-64 lg:w-72`}
>
  <Sidebar />
</div>

{/* Overlay for mobile when sidebar is open */}
{isSidebarOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    onClick={toggleSidebar}
    aria-hidden="true"
  ></div>
)}

      <div className="flex-1 flex flex-col">
        <AdminHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="p-4  flex-1 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;