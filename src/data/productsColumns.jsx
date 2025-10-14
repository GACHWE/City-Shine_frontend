import { createColumnHelper } from "@tanstack/react-table";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const columnHelper = createColumnHelper();

export const productsColumns = (onEdit, onDelete) => [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.getValue()?.substring(0, 8) + "...",
    size: 120,
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
          className="w-12 h-12 object-cover rounded-md shadow-sm"
        />
      ) : (
        <span className="text-gray-400 text-xs">No image</span>
      );
    },
    size: 80,
  }),

  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => (
      <div className="max-w-[200px] truncate" title={info.getValue()}>
        {info.getValue()}
      </div>
    ),
    size: 200,
  }),

  columnHelper.accessor("categoryName", {
    header: () => "Category",
    cell: (info) => {
      const category = info.getValue();
       if (typeof category === "string") return category;
      return category?.name || "Uncategorized";
    },
    size: 150,
  }),

  columnHelper.accessor("brand", {
    header: () => "Brand",
    cell: (info) => info.getValue() || "-",
    size: 120,
  }),

  columnHelper.accessor("price", {
    header: () => "Price",
    cell: (info) => {
      const value = info.getValue();
      return value ? `Ksh ${value.toFixed(2)}` : "Ksh 0.00";
    },
    size: 100,
  }),

  columnHelper.accessor("newArrival", {
    header: () => "New Arrival",
    cell: (info) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        info.getValue() 
          ? "bg-green-100 text-green-800" 
          : "bg-gray-100 text-gray-800"
      }`}>
        {info.getValue() ? "Yes" : "No"}
      </span>
    ),
    size: 100,
  }),

  columnHelper.accessor("variants", {
    header: () => "Stock",
    cell: (info) => {
      const variants = info.getValue();
      if (!variants || variants.length === 0) {
        return <span className="text-gray-500 text-xs">No variants</span>;
      }

      const totalStock = variants.reduce(
        (sum, variants) => sum + (variants.stockQuantity || 0),
        0
      );

      if (totalStock === 0) {
        return <span className="text-red-600 text-xs font-medium">Out of Stock</span>;
      }

      return (
        <span className="text-green-700 font-medium text-xs">
          {totalStock} in stock
        </span>
      );
    },
    size: 120,
  }),

  // columnHelper.accessor("createdAt", {
  //   header: () => "Created",
  //   cell: (info) => {
  //     const date = new Date(info.getValue());
  //     return date.toLocaleDateString();
  //   },
  //   size: 100,
  // }),

  columnHelper.display({
    id: "actions",
    header: () => "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(row.original)}
          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
          title="Edit product"
        >
          <FiEdit />
        </button>
        <button
          onClick={() => onDelete(row.original.id)}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
          title="Delete product"
        >
          <FiTrash2 />
        </button>
      </div>
    ),
    size: 100,
  }),
];