import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

function Filter({ column, table }) {
  const [value, setValue] = useState(column.getFilterValue() ?? "");

  const onChange = (e) => {
    setValue(e.target.value);
    table.getColumn(column.id)?.setFilterValue(e.target.value);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={`Filter ${column.columnDef.header}...`}
      className="w-full px-3 py-1 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-700 text-white"
    />
  );
}

const Table = ({
  data,
  fields,
  numberOfRows = 10,
  enableTopToolBar = true,
  enableBottomToolBar = true,
  enablePagination = true,
  enableRowSelection = false,
  enableColumnFilters = false,
  enableEditing = false,
  enableColumnDragging = false,
  showPreview = false,
  routeLink,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState({});
  // ✅ Safely handle fields
  if (!Array.isArray(fields)) {
    console.warn("⚠️ `fields` is not an array:", fields);
  }

  const columns = Array.isArray(fields)
    ? fields.map((field) => ({
        ...field,
        header: field.header,
        accessorKey: field.accessorKey,
      }))
    : [];

  if (showPreview) {
    columns.push({
      header: "Preview",
      id: "preview",
      cell: ({ row }) => (
        <Link
          to={`/${routeLink}/${row.original.id}`}
          className="text-blue-500 hover:underline"
        >
          View
        </Link>
      ),
    });
  }

  if (enableRowSelection) {
    columns.unshift({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="w-4 h-4"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          className="w-4 h-4"
        />
      ),
    });
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      rowSelection,
    },
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    table.setPageSize(numberOfRows);
  }, [numberOfRows, table]);

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {enableTopToolBar && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400" />
          </div>
        </div>
      )}

      <table className="overflow-x-auto">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-sm font-semibold"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>

              {row.getIsExpanded() && (
                <tr className="bg-gray-100 dark:bg-gray-900">
                  <td
                    colSpan={row.getVisibleCells().length}
                    className="px-6 py-4"
                  >
                    {/* Customize this content based on your data */}
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <div>
                        <strong>Customer Name:</strong>{" "}
                        {row.original.customerName || "N/A"}
                      </div>
                      <div>
                        <strong>Address:</strong>{" "}
                        {row.original.address
                          ? `${row.original.address.street}, ${row.original.address.city}, ${row.original.address.state}, ${row.original.address.zipCode}`
                          : "N/A"}
                      </div>
                      <div>
                        <strong>Phone:</strong>{" "}
                        {row.original.address?.phoneNumber || "N/A"}
                      </div>
                      <div>
                        <strong>Items:</strong>
                        <ul className="list-disc list-inside">
                          {row.original.orderItems.map((item, index) => (
                            <li key={index}>
                              {item.productName} (Qty: {item.quantity}) - $
                              {item.itemPrice?.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {row.original.expectedDeliveryDate && (
                        <div>
                          <strong>Expected Delivery:</strong>{" "}
                          {new Date(
                            row.original.expectedDeliveryDate
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {enableBottomToolBar && enablePagination && (
        <div className="flex items-center justify-between p-4 mt-4">
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Page{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {table.getPageCount()}
            </span>
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
