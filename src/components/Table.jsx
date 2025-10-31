import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
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
  pagination = {}, // External pagination props
  isLoading = false,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  
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

  // Use external pagination if provided, otherwise use internal
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getCoreRowModel(),
    // Manual pagination control
    manualPagination: !!pagination.totalPages, // Use manual if external pagination provided
    pageCount: pagination.totalPages || undefined,
  });

  useEffect(() => {
    if (!pagination.totalPages) {
      // Only use internal pagination if no external pagination provided
      table.setPageSize(numberOfRows);
    }
  }, [numberOfRows, table, pagination.totalPages]);

  // Handle external pagination
  const handlePreviousPage = () => {
    if (pagination.onPageChange && pagination.page > 0) {
      pagination.onPageChange(pagination.page - 1);
    } else {
      table.previousPage();
    }
  };

  const handleNextPage = () => {
    if (pagination.onPageChange && pagination.page < pagination.totalPages - 1) {
      pagination.onPageChange(pagination.page + 1);
    } else {
      table.nextPage();
    }
  };

  const canPreviousPage = pagination.totalPages 
    ? pagination.page > 0 
    : table.getCanPreviousPage();

  const canNextPage = pagination.totalPages 
    ? pagination.page < pagination.totalPages - 1 
    : table.getCanNextPage();

  const currentPage = pagination.totalPages 
    ? pagination.page 
    : table.getState().pagination.pageIndex;

  const totalPages = pagination.totalPages || table.getPageCount();

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

      <div className="overflow-x-auto">
        <table className="w-full">
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
            {isLoading ? (
              // Loading state
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <FiSearch className="animate-spin mr-2" />
                    Loading data...
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    No data available
                  </div>
                </td>
              </tr>
            ) : (
              // Data rows
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {enableBottomToolBar && enablePagination && (
        <div className="flex items-center justify-between p-4 mt-4">
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Page{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {currentPage + 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalPages}
            </span>
            {pagination.totalItems && (
              <span className="ml-2">
                (Total: {pagination.totalItems} items)
              </span>
            )}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={!canPreviousPage}
              className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={handleNextPage}
              disabled={!canNextPage}
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