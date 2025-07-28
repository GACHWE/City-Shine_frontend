import React from "react";
import BarChart from "../../components/HeroSection/charts/BarChart";
import Stats from "../../components/HeroSection/stats/Stats";
// import TopCountries from "../../components/HeroSection/TopCountries";
import TransactionCustomer from "../../components/HeroSection/TransactionCustomer";
import Table from "../../components/Table";
import { orders } from "../../data/orders";
import { ordersColumns } from "../../data/ordersColumns";


const Dashboard = () => {
  return (
    <div className="pt-5 pb-5 ml-80">
      <h1 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Dashboard
      </h1>

      <div className="mt-2 pb-2">
        <Stats />
      </div>

      <div className="mt-2 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-1 lg:col-span-2">
            <BarChart />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            {/* <div
              className="
                rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800 shadow-sm h-full
              "
            >
              <TopCountries />
            </div> */}
          </div>
        </div>
      </div>

      <div className="mt-2 pb-2">
        <TransactionCustomer />
      </div>

      <div className="mt-2 pb-2">
        <h2 className="text-2xl font-semibold my-4 text-gray-900 dark:text-gray-100">
          Latest Orders
        </h2>
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
  );
};

export default Dashboard;
