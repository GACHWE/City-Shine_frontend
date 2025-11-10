import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common";
import { getCustomerOrdersAPI, cancelOrderAPI } from "../../api/order";
import OrderStatusBadge from "../../components/layouts/OrderStatusBadge";
import OrderDetails from "../Orderdetails/OrderDetailsModal";
import {
  FaShoppingBag,
  FaExclamationTriangle,
  FaSync,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaWhatsapp,
} from "react-icons/fa";
import { formatCurrency, formatDate, formatOrderId } from "../../utils/format";

const CustomerOrders = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("ACTIVE");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const shopNumber = "254739299636";

  const filterOptions = [
    { value: "ACTIVE", label: "Active", color: "bg-blue-500" },
    { value: "COMPLETED", label: "Completed", color: "bg-green-500" },
    { value: "CANCELLED", label: "Cancelled", color: "bg-red-500" },
    { value: "ALL", label: "All", color: "bg-gray-500" },
  ];

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    dispatch(setLoading(true));

    try {
      const response = await getCustomerOrdersAPI(page, pageSize);
      setOrders(response.content);
      setFilteredOrders(response.content);
    } catch (err) {
      setError(err.message || "Failed to fetch your orders");
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch, page]);

  const handleCancelOrder = useCallback(
    async (orderId) => {
      if (window.confirm("Are you sure you want to cancel this order?")) {
        dispatch(setLoading(true));
        try {
          await cancelOrderAPI(orderId);
          setOrders((prev) =>
            prev.map((order) =>
              order.id === orderId ? { ...order, orderStatus: "CANCELLED" } : order
            )
          );
          setFilteredOrders((prev) =>
            prev.map((order) =>
              order.id === orderId ? { ...order, orderStatus: "CANCELLED" } : order
            )
          );
        } catch (err) {
          alert(err.message || "Failed to cancel order");
        } finally {
          dispatch(setLoading(false));
        }
      }
    },
    [dispatch]
  );

  const handleViewOrder = useCallback((order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  }, []);

  const handleFilterChange = useCallback(
    (filter) => {
      setSelectedFilter(filter);
      const filtered = orders.filter((order) => {
        switch (filter) {
          case "ACTIVE":
            return ["PENDING", "PROCESSING"].includes(order.orderStatus);
          case "COMPLETED":
            return order.orderStatus === "DELIVERED";
          case "CANCELLED":
            return order.orderStatus === "CANCELLED";
          default:
            return true;
        }
      });
      setFilteredOrders(filtered);
    },
    [orders]
  );

  const getOrderIcon = useCallback((status) => {
    switch (status) {
      case "PENDING":
        return <FaClock className="w-5 h-5 text-yellow-500" />;
      case "PROCESSING":
        return <FaBox className="w-5 h-5 text-purple-500" />;
      case "DELIVERED":
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case "CANCELLED":
        return <FaTimesCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FaBox className="w-5 h-5 text-gray-500" />;
    }
  }, []);

  // Function to generate WhatsApp link for a specific order
  const getWhatsAppLink = useCallback((orderId) => {
    const message = `Hello, I'd like more details about my order ${formatOrderId(orderId)}.`;
    return `https://wa.me/${shopNumber}?text=${encodeURIComponent(message)}`;
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              Loading your orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md mx-2 sm:mx-0">
            <FaExclamationTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 px-4">
              Unable to load orders
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 px-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              My Orders
            </h1>
            <p className="mt-1 sm:mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Track and manage your orders
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={fetchOrders}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors text-sm sm:text-base order-2 xs:order-1"
            >
              <FaSync className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Filter Orders:
            </h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedFilter === option.value
                      ? `${option.color} text-white shadow-md`
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {selectedFilter === option.value && (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    )}
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Total Orders
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.length}
                </p>
              </div>
              <FaShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Active</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.filter((o) =>
                    ["PENDING", "PROCESSING"].includes(o.orderStatus)
                  ).length}
                </p>
              </div>
              <FaBox className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Delivered
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.filter((o) => o.orderStatus === "DELIVERED").length}
                </p>
              </div>
              <FaTruck className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Cancelled
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.filter((o) => o.orderStatus === "CANCELLED").length}
                </p>
              </div>
              <FaTimesCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-lg shadow mx-2 sm:mx-0">
            <FaShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
              No {selectedFilter.toLowerCase() !== "all" ? selectedFilter.toLowerCase() : ""} orders found
            </p>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 px-4">
              {selectedFilter === "ACTIVE"
                ? "You don't have any active orders at the moment."
                : selectedFilter === "COMPLETED"
                ? "You don't have any completed orders yet."
                : selectedFilter === "CANCELLED"
                ? "You don't have any cancelled orders."
                : "You don't have any orders yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 mx-2 sm:mx-0">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-row xs:items-center gap-2 sm:gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getOrderIcon(order.orderStatus)}
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                            Order {formatOrderId(order.id)}
                          </h3>
                        </div>
                        <OrderStatusBadge status={order.orderStatus} />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                      <div className="flex flex-column xs:items-center gap-2 sm:gap-4 mt-2">
                        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Payment: {order.paymentStatus} • {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col xs:flex-row gap-2 xs:w-auto mt-3 xs:mt-0">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm"
                      >
                        View Details
                      </button>
                      {/* WhatsApp Contact */}
                      <a
                        href={getWhatsAppLink(order.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm"
                      >
                        <FaWhatsapp className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                        <span className="sm:hidden">Contact</span>
                      </a>
                      {order.orderStatus !== "CANCELLED" &&
                        order.orderStatus !== "DELIVERED" && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm"
                          >
                            Cancel Order
                          </button>
                        )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">
                    Order Items ({order.orderItemList?.length || 0})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {order.orderItemList?.slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded border"
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.product?.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} × {formatCurrency(item.itemPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.orderItemList?.length > 4 && (
                      <div className="flex items-center justify-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded border">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          +{order.orderItemList.length - 4} more items
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                      Expected delivery:{" "}
                      {formatDate(order.expectedDeliveryDate) || "To be confirmed"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isDetailsOpen && selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            isOpen={isDetailsOpen}
            onClose={handleCloseDetails}
            onCancelOrder={handleCancelOrder}
            isAdmin={false}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;