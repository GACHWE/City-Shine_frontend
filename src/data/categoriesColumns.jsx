// import { createColumnHelper } from "@tanstack/react-table";
// import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import icons

// const columnHelper = createColumnHelper();

// export const categoriesColumns = (onEdit, onDelete) => [
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
//   }),
//   // New 'Actions' column
//   columnHelper.display({
//     id: "actions",
//     header: () => "Actions",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => onEdit(row.original)} // Pass the full category object to the edit handler
//           className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
//         >
//           <FiEdit />
//         </button>
//         <button
//           onClick={() => onDelete(row.original.id)} // Pass only the ID to the delete handler
//           className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
//         >
//           <FiTrash2 />
//         </button>
//       </div>
//     ),
//   }),
// ];

import { createColumnHelper } from "@tanstack/react-table";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const columnHelper = createColumnHelper();

export const categoriesColumns = (onEdit, onDelete) => [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => {
      const value = info.getValue();
      return value ? `${value.substring(0, 8)}...` : "N/A";
    },
    size: 80,
    minSize: 70,
  }),
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => {
      const value = info.getValue();
      return (
        <div 
          className="max-w-[100px] sm:max-w-[150px] truncate" 
          title={value}
        >
          {value}
        </div>
      );
    },
    size: 120,
    minSize: 100,
  }),
  columnHelper.accessor("code", {
    header: () => "Code",
    cell: (info) => {
      const value = info.getValue();
      return (
        <div 
          className="max-w-[80px] sm:max-w-[120px] truncate" 
          title={value}
        >
          {value}
        </div>
      );
    },
    size: 100,
    minSize: 80,
  }),
  columnHelper.accessor("description", {
    header: () => "Description",
    cell: (info) => {
      const value = info.getValue();
      return (
        <div 
          className="max-w-[120px] sm:max-w-[200px] truncate" 
          title={value}
        >
          {value || "-"}
        </div>
      );
    },
    size: 150,
    minSize: 120,
  }),
  columnHelper.display({
    id: "actions",
    header: () => "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => onEdit(row.original)}
          className="p-1 sm:p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
          title="Edit category"
        >
          <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => onDelete(row.original.id)}
          className="p-1 sm:p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
          title="Delete category"
        >
          <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    ),
    size: 80,
    minSize: 70,
  }),
];