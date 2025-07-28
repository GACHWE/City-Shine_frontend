// src/data/productsColumns.js

import { createColumnHelper } from "@tanstack/react-table";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Make sure you import these icons

const columnHelper = createColumnHelper();

// This should be a function that accepts onEdit and onDelete
export const productsColumns = (onEdit, onDelete) => [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),
  // Adding back category.name as it should be part of the product data you fetch
  columnHelper.accessor("category.name", {
    header: () => "Category",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("brand", {
    header: () => "Brand",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("price", {
    header: () => "Price",
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("is_new_arrival", { // Assuming this field exists on your product data
    header: () => "New Arrival",
    cell: (info) => (info.getValue() ? "Yes" : "No"),
  }),
  // Action column for Edit and Delete buttons
  columnHelper.display({
    id: "actions",
    header: () => "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(row.original)} // Pass the full product object to the edit handler
          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <FiEdit />
        </button>
        <button
          onClick={() => onDelete(row.original.id)} // Pass only the ID to the delete handler
          className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
        >
          <FiTrash2 />
        </button>
      </div>
    ),
  }),
];