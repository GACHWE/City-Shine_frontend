// src/components/home/stats/Stats.jsx

import React from "react";
import { FiDollarSign, FiShoppingCart, FiUsers, FiBox } from "react-icons/fi";

const statsData = [
  {
    title: "Total Sales",
    value: "$4,525",
    change: "+12.5%",
    changeType: "positive",
    icon: <FiDollarSign />,
  },
  {
    title: "Total Orders",
    value: "1,254",
    change: "+1.8%",
    changeType: "positive",
    icon: <FiShoppingCart />,
  },
  {
    title: "New Customers",
    value: "345",
    change: "-0.5%",
    changeType: "negative",
    icon: <FiUsers />,
  },
  {
    title: "Products Sold",
    value: "8,750",
    change: "+20.1%",
    changeType: "positive",
    icon: <FiBox />,
  },
];

const StatCard = ({ title, value, change, changeType, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="text-gray-500 dark:text-gray-400 text-sm">{title}</div>
        <div className="text-gray-500 dark:text-gray-400 text-xl">{icon}</div>
      </div>
      <div className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </div>
      <div className="mt-2 text-sm font-medium">
        <span
          className={`
            ${changeType === "positive" ? "text-green-600" : "text-red-600"}
          `}
        >
          {change}
        </span>{" "}
        <span className="text-gray-500 dark:text-gray-400">
          from last month
        </span>
      </div>
    </div>
  );
};

const Stats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default Stats;