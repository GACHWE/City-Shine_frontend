import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ordersColumns } from "../../../data/ordersColumns";
import Table from "../../../components/Table";
import {
  FaSync,
  FaFilter,
  FaSearch,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaCog,
  FaBox,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  getAdminOrdersAPI,
  markAsProcessingAPI,
  markAsDeliveredAPI,
  cancelOrderAPI,
} from "../../../api/order";
import { useOrderStatus } from "../../../components/layouts/OrderStatusBadge";

const AdminOrders = () => {
  const { isFinalStatus } = useOrderStatus();
  const [ordersData, setOrdersData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 20,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters = {
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
      };

      const data = await getAdminOrdersAPI(
        pagination.pageIndex,
        pagination.pageSize,
        filters
      );

      console.log("Admin orders data:", data); // Debug log
      setOrdersData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, statusFilter]);

  const handleCancelOrder = useCallback(
    async (orderId) => {
      if (!window.confirm("Are you sure you want to cancel this order?"))
        return;

      try {
        await cancelOrderAPI(orderId);
        fetchOrders();
      } catch (err) {
        alert(err.message || "Failed to cancel order");
      }
    },
    [fetchOrders]
  );

  const handleStatusUpdate = useCallback(
    async (orderId, newStatus) => {
      try {
        if (newStatus === "PROCESSING") {
          await markAsProcessingAPI(orderId);
        } else if (newStatus === "DELIVERED") {
          await markAsDeliveredAPI(orderId);
        }
        fetchOrders();
      } catch (err) {
        alert(err.message || "Failed to update order status");
      }
    },
    [fetchOrders]
  );

  const refreshOrders = useCallback(() => {
    setIsRefreshing(true);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const columns = useMemo(
    () => ordersColumns(handleCancelOrder, handleStatusUpdate, true),
    [handleCancelOrder, handleStatusUpdate]
  );

  const stats = useMemo(
    () => [
      {
        label: "Total Orders",
        value: ordersData.totalElements,
        color: "blue",
        icon: <FaBox className="text-blue-500" />,
      },
      {
        label: "Pending",
        value: ordersData.content.filter((o) => o.orderStatus === "PENDING")
          .length,
        color: "yellow",
        icon: <FaClock className="text-yellow-500" />,
      },
      {
        label: "Processing",
        value: ordersData.content.filter((o) => o.orderStatus === "PROCESSING")
          .length,
        color: "purple",
        icon: <FaCog className="text-purple-500" />,
      },
      {
        label: "Delivered",
        value: ordersData.content.filter((o) => o.orderStatus === "DELIVERED")
          .length,
        color: "green",
        icon: <FaCheckCircle className="text-green-500" />,
      },
      {
        label: "Unpaid",
        value: ordersData.content.filter(
          (o) => o.paymentStatus === "PENDING" || o.paymentStatus === "UNPAID"
        ).length,
        color: "red",
        icon: <FaMoneyBillWave className="text-red-500" />,
      },
    ],
    [ordersData.content, ordersData.totalElements]
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: "All Statuses" },
      { value: "PENDING", label: "Pending" },
      { value: "CONFIRMED", label: "Confirmed" },
      { value: "PROCESSING", label: "Processing" },
      { value: "DELIVERED", label: "Delivered" },
      { value: "CANCELLED", label: "Cancelled" },
      { value: "PAYMENT_FAILED", label: "Payment Failed" },
    ],
    []
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading && !isRefreshing) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="text-red-500 dark:text-red-400 mb-4 text-5xl">
            <FaExclamationTriangle className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Unable to load orders
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={refreshOrders}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-10 px-3 sm:px-4 lg:px-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
              Orders Management
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Manage and track all customer orders
            </p>
          </div>

          <button
            onClick={refreshOrders}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all w-full sm:w-auto justify-center"
          >
            <FaSync
              className={`w-3 h-3 sm:w-4 sm:h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="text-sm sm:text-base">Refresh</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {stats.map(({ label, value, color, icon }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide truncate">
                    {label}
                  </h3>
                  <p className={`mt-1 sm:mt-2 text-lg sm:text-xl lg:text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>
                    {value}
                  </p>
                </div>
                <div className="p-1 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ml-2 flex-shrink-0">
                  {React.cloneElement(icon, { className: `w-3 h-3 sm:w-4 sm:h-4 ${icon.props.className}` })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, email, name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 sm:flex-none min-w-[150px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base flex-1 sm:flex-none"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Orders ({ordersData.content.length} of {ordersData.totalElements})
            </h3>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Page {ordersData.number + 1} of {ordersData.totalPages}
            </span>
          </div>
          <div className="dark:text-white overflow-x-auto">
            {ordersData.content.length > 0 ? (
              <div className="min-w-[800px] xl:min-w-0">
                <Table
                  data={ordersData.content}
                  fields={columns}
                  pageCount={ordersData.totalPages}
                  pagination={pagination}
                  onPaginationChange={({ pageIndex }) =>
                    setPagination((prev) => ({ ...prev, pageIndex }))
                  }
                  enablePagination={true}
                  enableSorting={true}
                />
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center">
                <FaBox className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  No orders found
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-3 sm:mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm sm:text-base"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;