// src/data/ordersColumns.js

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const ordersColumns = [
  columnHelper.accessor("id", {
    header: () => "Order ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("customer", {
    header: () => "Customer",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("orderDate", {
    header: () => "Order Date",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: () => "Status",
    cell: (info) => {
      const status = info.getValue();
      const statusColor =
        status === "Delivered"
          ? "bg-green-100 text-green-800"
          : status === "Shipped"
          ? "bg-blue-100 text-blue-800"
          : status === "Pending"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-gray-100 text-gray-800";
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}
        >
          {status}
        </span>
      );
    },
  }),
  columnHelper.accessor("total", {
    header: () => "Total",
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("products", {
    header: () => "Products",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("paymentMethod", {
    header: () => "Payment Method",
    cell: (info) => info.getValue(),
  }),
];