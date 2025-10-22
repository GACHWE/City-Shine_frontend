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

  // TODO: Consider implementing infinite scroll or lazy loading for large datasets
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

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Loading your orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Unable to load orders
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              My Orders
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Track and manage your orders
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaSync className="w-4 h-4" />
              Refresh
            </button>
            <select
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">Active Orders</option>
              <option value="COMPLETED">Completed Orders</option>
              <option value="CANCELLED">Cancelled Orders</option>
              <option value="ALL">All Orders</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.length}
                </p>
              </div>
              <FaShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.filter((o) =>
                    ["PENDING", "PROCESSING"].includes(o.orderStatus)
                  ).length}
                </p>
              </div>
              <FaBox className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Delivered
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.filter((o) => o.orderStatus === "DELIVERED").length}
                </p>
              </div>
              <FaTruck className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Cancelled
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.filter((o) => o.orderStatus === "CANCELLED").length}
                </p>
              </div>
              <FaTimesCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <FaShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No orders found
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {selectedFilter === "ACTIVE"
                ? "You don't have any active orders at the moment."
                : `You don't have any ${selectedFilter.toLowerCase()} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getOrderIcon(order.orderStatus)}
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Order {formatOrderId(order.id)}
                          </h3>
                        </div>
                        <OrderStatusBadge status={order.orderStatus} />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Payment: {order.paymentStatus} • {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                      {order.orderStatus !== "CANCELLED" &&
                        order.orderStatus !== "DELIVERED" && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Cancel Order
                          </button>
                        )}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Order Items ({order.orderItemList?.length || 0})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.orderItemList?.slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded border"
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.product?.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} × {formatCurrency(item.itemPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.orderItemList?.length > 4 && (
                      <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded border">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          +{order.orderItemList.length - 4} more items
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
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