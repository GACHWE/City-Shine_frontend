import React from "react";
import BarChart from "../../components/HeroSection/charts/BarChart";
import Stats from "../../components/HeroSection/stats/Stats";
import TransactionCustomer from "../../components/HeroSection/TransactionCustomer";
import Table from "../../components/Table";
import { orders } from "../../data/orders";
import { ordersColumns } from "../../data/ordersColumns";

const Dashboard = () => {
  return (
    <div className="pt-5 pb-5 px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Dashboard
      </h1>

      {/* Stats Section */}
      <div className="mb-6">
        <Stats />
      </div>

      {/* Charts Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BarChart />
          </div>
          <div className="lg:col-span-1">{/* Reserved for extra widgets */}</div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="mb-6">
        <TransactionCustomer />
      </div>

      {/* Orders Table Section */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Latest Orders
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <Table
            data={orders}
            fields={ordersColumns}
            numberOfRows={5}
            enableTopToolBar={false}
            enableBottomToolBar={false}
            enablePagination={false}
            enableRowSelection={false}
            enableColumnFilters={false}
            enableEditing={false}
            enableColumnDragging={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
