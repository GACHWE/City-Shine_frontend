import { createColumnHelper } from "@tanstack/react-table";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const columnHelper = createColumnHelper();

export const productsColumns = (onEdit, onDelete) => [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => {
      const value = info.getValue();
      return value ? `${value.substring(0, 8)}...` : "N/A";
    },
    size: 80,
    minSize: 70,
  }),

  columnHelper.accessor("productResources", {
    header: () => "Image",
    cell: (info) => {
      const resources = info.getValue();
      const thumbnail = resources?.find(res => res.isPrimary)?.url || resources?.[0]?.url;
      return thumbnail ? (
        <img
          src={thumbnail}
          alt="Product"
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-cover rounded-md shadow-sm"
        />
      ) : (
        <span className="text-gray-400 text-xs">No image</span>
      );
    },
    size: 70,
    minSize: 60,
  }),

  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => {
      const value = info.getValue();
      return (
        <div 
          className="max-w-[120px] sm:max-w-[150px] lg:max-w-[200px] truncate" 
          title={value}
        >
          {value}
        </div>
      );
    },
    size: 150,
    minSize: 120,
  }),

  columnHelper.accessor("categoryName", {
    header: () => "Category",
    cell: (info) => {
      const category = info.getValue();
      if (typeof category === "string") return category;
      return category?.name || "Uncategorized";
    },
    size: 120,
    minSize: 100,
  }),

  columnHelper.accessor("brand", {
    header: () => "Brand",
    cell: (info) => info.getValue() || "-",
    size: 100,
    minSize: 80,
  }),

  columnHelper.accessor("price", {
    header: () => "Price",
    cell: (info) => {
      const value = info.getValue();
      return value ? `Ksh ${value.toFixed(2)}` : "Ksh 0.00";
    },
    size: 90,
    minSize: 80,
  }),

  columnHelper.accessor("newArrival", {
    header: () => "New",
    cell: (info) => (
      <span 
        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          info.getValue() 
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {info.getValue() ? "Yes" : "No"}
      </span>
    ),
    size: 70,
    minSize: 60,
  }),

  columnHelper.accessor("variants", {
    header: () => "Stock",
    cell: (info) => {
      const variants = info.getValue();
      if (!variants || variants.length === 0) {
        return <span className="text-gray-500 text-xs">No variants</span>;
      }

      const variant = variants[0];
      const stockQuantity = variant.stockQuantity || 0;

      if (stockQuantity === 0) {
        return <span className="text-red-600 text-xs font-medium whitespace-nowrap">Out of Stock</span>;
      }

      return (
        <span className="text-green-700 font-medium text-xs whitespace-nowrap">
          {stockQuantity} in stock
        </span>
      );
    },
    size: 100,
    minSize: 90,
  }),

  columnHelper.display({
    id: "actions",
    header: () => "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => onEdit(row.original)}
          className="p-1 sm:p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
          title="Edit product"
        >
          <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => onDelete(row.original.id)}
          className="p-1 sm:p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
          title="Delete product"
        >
          <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    ),
    size: 80,
    minSize: 70,
  }),
];