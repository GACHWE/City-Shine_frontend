// src/components/home/TransactionCustomer.jsx

import React from "react";
import { Link } from "react-router-dom";

const recentTransactions = [
  {
    id: 1,
    customer: "Alice Johnson",
    amount: "$250.00",
    date: "24 Jul, 2025",
    status: "Completed",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: 2,
    customer: "Bob Williams",
    amount: "$150.50",
    date: "23 Jul, 2025",
    status: "Pending",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
  },
  {
    id: 3,
    customer: "Charlie Brown",
    amount: "$89.99",
    date: "22 Jul, 2025",
    status: "Completed",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
  },
  {
    id: 4,
    customer: "Diana Prince",
    amount: "$450.75",
    date: "22 Jul, 2025",
    status: "Completed",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
  },
];

const TransactionCustomer = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Transactions
        </h2>
        <Link
          to="/admin/orders"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="mt-4 space-y-4 flex-1">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <img
                src={transaction.avatar}
                alt={transaction.customer}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {transaction.customer}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {transaction.date}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {transaction.amount}
              </span>
              <span
                className={`
                  ml-2 text-xs font-medium px-2 py-0.5 rounded-full
                  ${
                    transaction.status === "Completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }
                `}
              >
                {transaction.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionCustomer;