// //  src/data/categoriesColumns.js

// import { createColumnHelper } from "@tanstack/react-table";

// const columnHelper = createColumnHelper();

// export const categoriesColumns = [
//   columnHelper.accessor("id", {
//     header: () => "ID",
//     cell: (info) => info.getValue(),
//   }),
//   columnHelper.accessor("name", {
//     header: () => "Name",
//     cell: (info) => info.getValue(),
//   }),
//   columnHelper.accessor("code", {
//     header: () => "Code",
//     cell: (info) => info.getValue(),
//   }),
//   columnHelper.accessor("description", {
//     header: () => "Description",
//     cell: (info) => info.getValue(),
//   })]

// src/data/categoriesColumns.js

import { createColumnHelper } from "@tanstack/react-table";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import icons

const columnHelper = createColumnHelper();

export const categoriesColumns = (onEdit, onDelete) => [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("code", {
    header: () => "Code",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: () => "Description",
    cell: (info) => info.getValue(),
  }),
  // New 'Actions' column
  columnHelper.display({
    id: "actions",
    header: () => "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(row.original)} // Pass the full category object to the edit handler
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