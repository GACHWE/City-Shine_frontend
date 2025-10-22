// // components/orders/OrderDetails.jsx
// import React, { useState } from "react";
// import {
//   FaTimes,
//   FaReceipt,
//   FaUser,
//   FaMapMarkerAlt,
//   FaBox,
//   FaMoneyBillWave,
//   FaCheck,
//   FaClock,
//   FaImage,
// } from "react-icons/fa";
// import OrderStatusBadge from "../../components/layouts/OrderStatusBadge";
// import OrderReceipt from "../AdminPanel/Orders/OrderReceipt";

// const OrderDetails = ({
//   order,
//   isOpen,
//   onClose,
//   onStatusUpdate,
//   onCancelOrder,
//   isAdmin = false,
//   showActions = true,
// }) => {
//   const [newStatus, setNewStatus] = useState(order?.orderStatus || "");
//   const [showReceipt, setShowReceipt] = useState(false);
//   const [expandedImage, setExpandedImage] = useState(null);

//   if (!isOpen || !order) return null;

//   const handleStatusUpdate = async (status) => {
//     if (!onStatusUpdate || status === order.orderStatus) return;

//     try {
//       await onStatusUpdate(order.id, status);
//       onClose();
//     } catch (error) {
//       console.error("Failed to update status:", error);
//       alert("Failed to update order status");
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return isNaN(date.getTime())
//       ? "Invalid date"
//       : date.toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//   };

//   const formatCurrency = (amount) => {
//     if (amount == null) return "KES 0.00";
//     const num = Number(amount);
//     return isNaN(num) ? "KES 0.00" : `KES ${num.toFixed(2)}`;
//   };

//   const getStatusOptions = () => {
//     const baseOptions = [
//       { value: "PENDING", label: "Pending" },
//       { value: "PROCESSING", label: "Processing" },
//       { value: "DELIVERED", label: "Delivered" },
//       { value: "CANCELLED", label: "Cancelled" },
//     ];

//     if (
//       order.orderStatus === "CANCELLED" ||
//       order.orderStatus === "DELIVERED"
//     ) {
//       return baseOptions.filter((opt) => opt.value === order.orderStatus);
//     }
//     return baseOptions;
//   };

//   const ImageModal = ({ imageUrl, productName, onClose }) => {
//     if (!imageUrl) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60 p-4">
//         <div className="relative max-w-4xl max-h-full">
//           <button
//             onClick={onClose}
//             className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
//           >
//             <FaTimes className="w-6 h-6" />
//           </button>
//           <img
//             src={imageUrl}
//             alt={productName}
//             className="max-w-full max-h-full object-contain rounded-lg"
//           />
//           <p className="text-white text-center mt-2">{productName}</p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="p-6">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
//                   Order Details - #{order.id?.substring(0, 8).toUpperCase()}
//                 </h3>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   {formatDate(order.orderDate)}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 {isAdmin && (
//                   <button
//                     onClick={() => setShowReceipt(true)}
//                     className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center"
//                     title="View Receipt"
//                   >
//                     <FaReceipt className="w-4 h-4 mr-2" />
//                     Receipt
//                   </button>
//                 )}
//                 <button
//                   onClick={onClose}
//                   className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   <FaTimes className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Status Update Section (Admin only) */}
//             {isAdmin && showActions && (
//               <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                 <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
//                   Update Order Status
//                 </h4>
//                 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//                   <select
//                     value={newStatus}
//                     onChange={(e) => setNewStatus(e.target.value)}
//                     className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
//                   >
//                     {getStatusOptions().map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                   <button
//                     onClick={() => handleStatusUpdate(newStatus)}
//                     disabled={newStatus === order.orderStatus}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center transition-colors"
//                   >
//                     <FaCheck className="w-4 h-4 mr-2" />
//                     Update Status
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Two-column layout */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Left Column */}
//               <div className="space-y-6">
//                 {/* Order Summary */}
//                 <div>
//                   <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
//                     <FaReceipt className="w-5 h-5 mr-2 text-blue-600" />
//                     Order Summary
//                   </h4>
//                   <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-sm text-gray-600 dark:text-gray-300">
//                           Order Status
//                         </p>
//                         <OrderStatusBadge status={order.orderStatus} />
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-600 dark:text-gray-300">
//                           Payment Status
//                         </p>
//                         <OrderStatusBadge
//                           status={order.paymentStatus}
//                           type="payment"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600 dark:text-gray-300">
//                         Total Amount
//                       </p>
//                       <p className="font-medium text-gray-800 dark:text-white">
//                         {formatCurrency(order.totalAmount)}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600 dark:text-gray-300">
//                         Payment Method
//                       </p>
//                       <p className="font-medium text-gray-800 dark:text-white">
//                         {order.paymentMethod || "N/A"}
//                       </p>
//                     </div>
//                     {order.shipmentNumber && (
//                       <div>
//                         <p className="text-sm text-gray-600 dark:text-gray-300">
//                           Tracking Number
//                         </p>
//                         <p className="font-medium text-gray-800 dark:text-white">
//                           {order.shipmentNumber}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Customer Information */}
//                 <div>
//                   <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
//                     <FaUser className="w-5 h-5 mr-2 text-green-600" />
//                     Customer Information
//                   </h4>
//                   <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
//                     <div>
//                       <p className="text-sm text-gray-600 dark:text-gray-300">
//                         Name
//                       </p>
//                       <p className="font-medium text-gray-800 dark:text-white">
//                         {order.customerName || "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600 dark:text-gray-300">
//                         Email
//                       </p>
//                       <p className="font-medium text-gray-800 dark:text-white">
//                         {order.customerEmail || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column - Order Items with Images */}
//               <div className="space-y-6">
//                 {/* Order Items */}
//                 <div>
//                   <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
//                     <FaBox className="w-5 h-5 mr-2 text-purple-600" />
//                     Order Items ({order.orderItemList?.length || 0})
//                   </h4>
//                   <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
//                     {order.orderItemList?.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex gap-4 p-4 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
//                       >
//                         {/* Product Image */}
//                         <div className="flex-shrink-0">
//                           {item.imageUrl ? (
//                             <button
//                               onClick={() =>
//                                 setExpandedImage({
//                                   url: item.imageUrl,
//                                   name: item.product?.name,
//                                 })
//                               }
//                               className="group relative"
//                             >
//                               <img
//                                 src={item.imageUrl}
//                                 alt={item.product?.name || "Product image"}
//                                 className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200 group-hover:opacity-80 transition-opacity"
//                               />
//                               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
//                                 <FaImage className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
//                               </div>
//                             </button>
//                           ) : (
//                             <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 dark:bg-gray-500 rounded-lg flex items-center justify-center">
//                               <FaImage className="w-8 h-8 text-gray-400" />
//                             </div>
//                           )}
//                         </div>

//                         {/* Product Details */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-start mb-2">
//                             <div className="flex-1">
//                               <h5 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">
//                                 {item.product?.name ||
//                                   "Product Name Not Available"}
//                               </h5>
//                               {item.product?.description && (
//                                 <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
//                                   {item.product.description}
//                                 </p>
//                               )}
//                             </div>
//                           </div>

//                           {/* Product Specifications */}
//                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
//                             <div className="space-y-1">
//                               {item.color && (
//                                 <div className="flex items-center">
//                                   <span className="text-gray-500 dark:text-gray-400 mr-2">
//                                     Color:
//                                   </span>
//                                   <span className="text-gray-800 dark:text-white font-medium">
//                                     {item.color}
//                                   </span>
//                                 </div>
//                               )}
//                               {item.conditionStatus && (
//                                 <div className="flex items-center">
//                                   <span className="text-gray-500 dark:text-gray-400 mr-2">
//                                     Condition:
//                                   </span>
//                                   <span className="text-gray-800 dark:text-white font-medium">
//                                     {item.conditionStatus}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>

//                             <div className="space-y-1">
//                               <div className="flex items-center">
//                                 <span className="text-gray-500 dark:text-gray-400 mr-2">
//                                   Quantity:
//                                 </span>
//                                 <span className="text-gray-800 dark:text-white font-medium">
//                                   {item.quantity}
//                                 </span>
//                               </div>
//                               <div className="flex items-center">
//                                 <span className="text-gray-500 dark:text-gray-400 mr-2">
//                                   Unit Price:
//                                 </span>
//                                 <span className="text-gray-800 dark:text-white font-medium">
//                                   {formatCurrency(item.itemPrice)}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Item Total */}
//                           <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-500">
//                             <div className="flex justify-between items-center">
//                               <span className="text-gray-600 dark:text-gray-300 font-medium">
//                                 Item Total:
//                               </span>
//                               <span className="text-lg font-bold text-gray-800 dark:text-white">
//                                 {formatCurrency(item.itemPrice * item.quantity)}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                     {/* Order Total */}
//                     <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
//                       <div className="flex justify-between items-center">
//                         <span className="text-lg font-semibold text-gray-800 dark:text-white">
//                           Order Total:
//                         </span>
//                         <span className="text-xl font-bold text-gray-800 dark:text-white">
//                           {formatCurrency(order.totalAmount)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Delivery Information */}
//                 <div>
//                   <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
//                     <FaMapMarkerAlt className="w-5 h-5 mr-2 text-orange-600" />
//                     Delivery Information
//                   </h4>
//                   <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
//                     {order.address ? (
//                       <>
//                         <div>
//                           <p className="text-sm text-gray-600 dark:text-gray-300">
//                             Recipient
//                           </p>
//                           <p className="font-medium text-gray-800 dark:text-white">
//                             {order.address.name}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-600 dark:text-gray-300">
//                             Address
//                           </p>
//                           <p className="font-medium text-gray-800 dark:text-white">
//                             {order.address.estate}, {order.address.county}
//                           </p>
//                           {order.address.additionalInfo && (
//                             <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                               {order.address.additionalInfo}
//                             </p>
//                           )}
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-600 dark:text-gray-300">
//                             Phone
//                           </p>
//                           <p className="font-medium text-gray-800 dark:text-white">
//                             {order.address.phoneNumber}
//                           </p>
//                         </div>
//                       </>
//                     ) : (
//                       <p className="text-gray-600 dark:text-gray-400">
//                         No delivery address provided
//                       </p>
//                     )}
//                     <div>
//                       <p className="text-sm text-gray-600 dark:text-gray-300">
//                         Expected Delivery
//                       </p>
//                       <p className="font-medium text-gray-800 dark:text-white">
//                         {order.expectedDeliveryDate
//                           ? formatDate(order.expectedDeliveryDate)
//                           : "To be confirmed"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             {showActions && (
//               <div className="flex flex-wrap justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
//                 {onCancelOrder &&
//                   order.orderStatus !== "CANCELLED" &&
//                   order.orderStatus !== "DELIVERED" && (
//                     <button
//                       onClick={() => onCancelOrder(order.id)}
//                       className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
//                     >
//                       <FaTimes className="w-4 h-4 mr-2" />
//                       Cancel Order
//                     </button>
//                   )}

//                 <button
//                   onClick={onClose}
//                   className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Expanded Image Modal */}
//       {expandedImage && (
//         <ImageModal
//           imageUrl={expandedImage.url}
//           productName={expandedImage.name}
//           onClose={() => setExpandedImage(null)}
//         />
//       )}

//       {/* Receipt Modal */}
//       {showReceipt && (
//         <OrderReceipt order={order} onClose={() => setShowReceipt(false)} />
//       )}
//     </>
//   );
// };

// export default OrderDetails;
// components/orders/OrderDetails.jsx
import React, { useState } from "react";
import {
  FaTimes,
  FaReceipt,
  FaUser,
  FaMapMarkerAlt,
  FaBox,
  FaCheck,
  FaImage,
  FaTag,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { OrderStatusBadge, useOrderStatus } from "../../components/layouts/OrderStatusBadge";
import OrderReceipt from "../AdminPanel/Orders/OrderReceipt";
import { formatCurrency, formatDate, formatOrderId } from "../../utils/format";

const OrderDetails = ({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
  onCancelOrder,
  isAdmin = false,
  showActions = true,
}) => {
  const { canProcess, canDeliver, isFinalStatus } = useOrderStatus();
  const [newStatus, setNewStatus] = useState(order?.orderStatus || "");
  const [showReceipt, setShowReceipt] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

  if (!isOpen || !order) return null;

  const handleStatusUpdate = async (status) => {
    if (!onStatusUpdate || status === order.orderStatus) return;
    try {
      await onStatusUpdate(order.id, status);
      onClose();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusOptions = () => {
    const baseOptions = [
      { value: "PENDING", label: "Pending" },
      { value: "CONFIRMED", label: "Confirmed" },
      { value: "PROCESSING", label: "Processing" },
      { value: "DELIVERED", label: "Delivered" },
      { value: "CANCELLED", label: "Cancelled" },
    ];
    if (isFinalStatus(order.orderStatus)) {
      return baseOptions.filter((opt) => opt.value === order.orderStatus);
    }
    return baseOptions;
  };

  const ImageModal = ({ imageUrl, productName, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60 p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
        >
          <FaTimes className="w-6 h-6" />
        </button>
        <img
          src={imageUrl}
          alt={productName}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        <p className="text-white text-center mt-2">{productName}</p>
      </div>
    </div>
  );

  const InfoCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={className}>
      <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        {title}
      </h4>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
        {children}
      </div>
    </div>
  );

  const InfoField = ({ label, value, children }) => (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
      {children || (
        <p className="font-medium text-gray-800 dark:text-white">
          {value || "N/A"}
        </p>
      )}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Order {formatOrderId(order.id)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => setShowReceipt(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center"
                    title="View Receipt"
                  >
                    <FaReceipt className="w-4 h-4 mr-2" />
                    Receipt
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {isAdmin && showActions && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                  Update Order Status
                </h4>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {getStatusOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleStatusUpdate(newStatus)}
                    disabled={
                      newStatus === order.orderStatus ||
                      (newStatus === "PROCESSING" && !canProcess(order.orderStatus)) ||
                      (newStatus === "DELIVERED" && !canDeliver(order.orderStatus))
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center transition-colors"
                  >
                    <FaCheck className="w-4 h-4 mr-2" />
                    Update Status
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <InfoCard
                  title="Order Summary"
                  icon={FaReceipt}
                  className="text-blue-600"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField label="Order Status">
                      <OrderStatusBadge status={order.orderStatus} />
                    </InfoField>
                    <InfoField label="Payment Status">
                      <OrderStatusBadge
                        status={order.paymentStatus}
                        type="payment"
                      />
                    </InfoField>
                  </div>
                  <InfoField
                    label="Total Amount"
                    value={formatCurrency(order.totalAmount)}
                  />
                  <InfoField label="Payment Method" value={order.paymentMethod} />
                  {order.shipmentNumber && (
                    <InfoField
                      label="Tracking Number"
                      value={order.shipmentNumber}
                    />
                  )}
                </InfoCard>

                <InfoCard
                  title="Customer Information"
                  icon={FaUser}
                  className="text-green-600"
                >
<InfoField label="Full Name" value={`${order.customerName} ${order.customerLastName}`} />                  <InfoField label="Email" value={order.customerEmail} />
                </InfoCard>
              </div>

              <div className="space-y-6">
                <InfoCard
                  title={`Order Items (${order.orderItemList?.length || 0})`}
                  icon={FaBox}
                  className="text-purple-400"
                >
                  <div className="space-y-4">
                    {order.orderItemList?.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                      >
                        <div className="flex-shrink-0">
                          {item.imageUrl ? (
                            <button
                              onClick={() =>
                                setExpandedImage({
                                  url: item.imageUrl,
                                  name: item.product?.name || "Product",
                                })
                              }
                              className="group relative"
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.product?.name || "Product image"}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200 group-hover:opacity-80 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                                <FaImage className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </button>
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-500 rounded-lg flex items-center justify-center">
                              <FaImage className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-800 dark:text-white text-lg mb-2">
                            {item.product?.name || "Product Name Not Available"}
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                            <div className="space-y-1">
                              {item.product?.categoryName && (
                                <div className="flex items-center">
                                  <FaTag className="w-3 h-3 mr-2 text-gray-400" />
                                  <span className="text-gray-600 dark:text-gray-300">
                                    Category:
                                  </span>
                                  <span className="ml-1 font-medium text-gray-800 dark:text-white">
                                    {item.product.categoryName}
                                  </span>
                                </div>
                              )}
                              {item.product?.brand && (
                                <div className="flex items-center">
                                  <FaInfoCircle className="w-3 h-3 mr-2 text-gray-400" />
                                  <span className="text-gray-600 dark:text-gray-300">
                                    Brand:
                                  </span>
                                  <span className="ml-1 font-medium text-gray-800 dark:text-white">
                                    {item.product.brand}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              {item.color && (
                                <div className="flex items-center">
                                  <div
                                    className="w-3 h-3 mr-2 rounded-full border border-gray-300"
                                    style={{
                                      backgroundColor: item.color.toLowerCase(),
                                    }}
                                  />
                                  <span className="text-gray-600 dark:text-gray-300">
                                    Color:
                                  </span>
                                  <span className="ml-1 font-medium text-gray-800 dark:text-white">
                                    {item.color}
                                  </span>
                                </div>
                              )}
                              {item.conditionStatus && (
                                <div className="flex items-center">
                                  <FaShieldAlt className="w-3 h-3 mr-2 text-gray-400" />
                                  <span className="text-gray-600 dark:text-gray-300">
                                    Condition:
                                  </span>
                                  <span className="ml-1 font-medium text-gray-800 dark:text-white">
                                    {item.conditionStatus}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-300">
                                Quantity:
                              </span>
                              <span className="ml-2 font-medium text-gray-800 dark:text-white">
                                {item.quantity}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-300">
                                Unit Price:
                              </span>
                              <span className="ml-2 font-medium text-gray-800 dark:text-white">
                                {formatCurrency(item.itemPrice)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-500">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-300 font-medium">
                                Item Total:
                              </span>
                              <span className="text-lg font-bold text-gray-800 dark:text-white">
                                {formatCurrency(
                                  (parseFloat(item.itemPrice) * item.quantity).toString()
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span className="text-gray-800 dark:text-white">
                          Order Total:
                        </span>
                        <span className="text-gray-800 dark:text-white">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </InfoCard>

                <InfoCard
                  title="Delivery Information"
                  icon={FaMapMarkerAlt}
                  className="text-orange-600"
                >
                  {order.address ? (
                    <>
                      <InfoField label="Recipient" value={order.address.name} />
                      <InfoField
                        label="Address"
                        value={`${order.address.estate}, ${order.address.county}`}
                      />
                      {order.address.additionalInstructions && (
                        <InfoField
                          label="Additional Info"
                          value={order.address.additionalInstructions}
                        />
                      )}
                      <InfoField
                        label="Phone"
                        value={order.address.phoneNumber}
                      />
                    </>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      No delivery address provided
                    </p>
                  )}
                  <InfoField
                    label="Expected Delivery"
                    value={
                      order.expectedDeliveryDate
                        ? formatDate(order.expectedDeliveryDate)
                        : "To be confirmed"
                    }
                  />
                </InfoCard>
              </div>
            </div>

            {showActions && (
              <div className="flex flex-wrap justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {onCancelOrder &&
                  !isFinalStatus(order.orderStatus) && (
                    <button
                      onClick={() => onCancelOrder(order.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <FaTimes className="w-4 h-4 mr-2" />
                      Cancel Order
                    </button>
                  )}
                <button
                  onClick={onClose}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {expandedImage && (
        <ImageModal
          imageUrl={expandedImage.url}
          productName={expandedImage.name}
          onClose={() => setExpandedImage(null)}
        />
      )}

      {showReceipt && isAdmin && (
        <OrderReceipt order={order} onClose={() => setShowReceipt(false)} />
      )}
    </>
  );
};

export default OrderDetails;