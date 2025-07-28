// src/components/layouts/AdminLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../AdminSidebar';
// These are placeholder components. You would replace these with your actual Header and Sidebar.
const AdminHeader = () => (
  <div className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center px-6">
    Admin Header
  </div>
);

// const AdminSidebar = () => (
//   <div className="w-64 min-h-screen bg-white dark:bg-gray-800 shadow-sm p-4">
//     Admin Sidebar
//   </div>
// );

const AdminLayout = () => {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="p-6 flex-1">
          <Outlet /> {/* This renders the content of the current route */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;