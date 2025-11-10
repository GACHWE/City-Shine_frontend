import { useState } from "react";
import AdminOrderDetailsModal from "../pages/Orderdetails/OrderDetailsModal";
import {
  cancelOrderAPI,
  markAsDeliveredAPI,
  markAsProcessingAPI,
  markAsConfirmedAPI,
} from "../api/order";

const StatusBadge = ({ status, type = "order" }) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
  const statusMap = {
    PENDING: `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`,
    CONFIRMED: `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`,
    PROCESSING: `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`,
    DELIVERED: `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`,
    CANCELLED: `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`,
    PAYMENT_FAILED: `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`,
    COMPLETED: `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`,
  };

  const getDisplayStatus = () => {
    if (!status) return "N/A";
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <span
      className={
        statusMap[status] ||
        `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`
      }
    >
      {getDisplayStatus()}
    </span>
  );
};

const ViewOrderButton = ({ order, onStatusUpdate, isAdmin = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs transition-colors"
        onClick={() => setIsModalOpen(true)}
        title="View Order Details"
      >
        View
      </button>

      {isModalOpen && (
        <AdminOrderDetailsModal
          order={order}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusUpdate={onStatusUpdate}
          isAdmin={isAdmin} // ✅ Add this prop
        />
      )}
    </>
  );
};

export const ordersColumns = (onCancel, onStatusUpdate, isAdmin = false) => {
  const safeOnCancel =
    typeof onCancel === "function"
      ? onCancel
      : () => console.warn("onCancel not available");
  const safeOnStatusUpdate =
    typeof onStatusUpdate === "function"
      ? onStatusUpdate
      : () => console.warn("onStatusUpdate not available");

  return [
    ...(isAdmin
      ? [
          {
            accessorKey: "orderId",
            header: "Order ID",
            cell: ({ row }) =>
              row.original.orderId
                ? `#${row.original.orderId.substring(0, 8)}`
                : "N/A",
            size: 120,
          },
          {
            accessorKey: "customerName",
            header: "Customer",
            cell: ({ row }) => row.original.customerName || "Unknown Customer",
            size: 150,
          },
          {
            accessorKey: "customerEmail",
            header: "Email",
            cell: ({ row }) => row.original.customerEmail || "N/A",
            size: 200,
          },
        ]
      : []),

    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) => {
        const date = row.original.orderDate;
        if (!date) return "N/A";
        try {
          return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch {
          return "Invalid date";
        }
      },
      size: 160,
    },

    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) =>
        row.original.totalAmount != null
          ? `KES ${Number(row.original.totalAmount).toFixed(2)}`
          : "KES 0.00",
      size: 120,
    },

    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) =>
        row.original.paymentMethod
          ? row.original.paymentMethod.toUpperCase()
          : "N/A",
      size: 120,
    },

    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.paymentStatus} type="payment" />
      ),
      size: 120,
    },

    {
      accessorKey: "orderStatus",
      header: "Order Status",
      cell: ({ row }) => <StatusBadge status={row.original.orderStatus} />,
      size: 140,
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        const status = order.orderStatus || "";
        const orderId = order.id; 

        const canCancel = ![
          "CANCELLED",
          "DELIVERED",
          "COMPLETED",
          "PAYMENT_FAILED",
        ].includes(status);
        const canProcess = status === "CONFIRMED";
        const canDeliver = status === "PROCESSING";
        const canConfirm = status === "PENDING";

        // Handler functions for each action - defined INSIDE the cell function
        const handleCancel = async () => {
          try {
            await cancelOrderAPI(orderId);
            safeOnCancel(orderId);
            safeOnStatusUpdate(orderId, "CANCELLED");
          } catch (error) {
            console.error("Failed to cancel order:", error);
          }
        };

        const handleProcess = async () => {
          try {
            await markAsProcessingAPI(orderId);
            safeOnStatusUpdate(orderId, "PROCESSING");
          } catch (error) {
            console.error("Failed to mark as processing:", error);
          }
        };

        const handleConfirm = async () => {
          try {
            await markAsConfirmedAPI(orderId);
            safeOnStatusUpdate(orderId, "CONFIRMED");
          } catch (error) {
            console.error("Failed to mark as confirmed:", error);
          }
        };

        const handleDeliver = async () => {
          try {
            await markAsDeliveredAPI(orderId);
            safeOnStatusUpdate(orderId, "DELIVERED");
          } catch (error) {
            console.error("Failed to mark as delivered:", error);
          }
        };

        return (
          <div className="flex space-x-2">
            <ViewOrderButton
              order={order}
              onStatusUpdate={safeOnStatusUpdate}
              isAdmin={isAdmin}
            />

            {canCancel && (
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs transition-colors"
                onClick={handleCancel}
                title="Cancel Order"
              >
                Cancel
              </button>
            )}

            {canConfirm && (
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs transition-colors"
                onClick={handleConfirm}
                title="Mark as Confirmed"
              >
                Confirm
              </button>
            )}

            {canProcess && (
              <button
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-xs transition-colors"
                onClick={handleProcess}
                title="Mark as Processing"
              >
                Process
              </button>
            )}

            {canDeliver && (
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs transition-colors"
                onClick={handleDeliver}
                title="Mark as Delivered"
              >
                Deliver
              </button>
            )}
          </div>
        );
      },
      size: 200,
    },
  ];
};
