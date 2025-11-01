// import React, { useEffect, useState, useCallback } from "react";
// import { ordersColumns } from "../../../data/ordersColumns";
// import Table from "../../../components/Table";
// import axios from "axios";
// import { API_BASE_URL, getHeaders } from "../../../api/constant";
// import {
//   FaSync,
//   FaDownload,
//   FaFilter,
//   FaSearch,
//   FaExclamationTriangle,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaClock,
//   FaSortAmountDown
// } from "react-icons/fa";

// const Orders = () => {
//   const [orders, setOrders] = useState({
//     content: [],
//     totalElements: 0,
//     totalPages: 0,
//     size: 20,
//     number: 0,
//     first: true,
//     last: true,
//     numberOfElements: 0
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 20,
//   });

//   const fetchOrders = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // Build query parameters based on your backend API
//       const params = {
//         page: pagination.pageIndex,
//         size: pagination.pageSize,
//       };

//       // Add status filter if not "all"
//       if (statusFilter !== "all") {
//         params.status = statusFilter;
//       }

//       // Add search query if provided
//       if (searchQuery) {
//         params.q = searchQuery;
//       }

//       const config = {
//         headers: getHeaders(),
//         params: params
//       };

//       // Use your admin orders endpoint
//       const res = await axios.get(`${API_BASE_URL}/api/admin/orders`, config);
//       setOrders(res.data);
//     } catch (err) {
//       console.error("Failed to fetch orders", err);
//       setError(err.response?.data?.message || "Unable to fetch orders. Please check your connection.");
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   }, [pagination.pageIndex, pagination.pageSize, searchQuery, statusFilter]);

//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   const handlePaginationChange = (newPagination) => {
//     setPagination(newPagination);
//   };

//   const cancelOrder = async (orderId) => {
//     if (!window.confirm("Are you sure you want to cancel this order?")) return;
//     try {
//       const config = { headers: getHeaders() };
//       await axios.post(`${API_BASE_URL}/api/admin/orders/${orderId}/cancel`, null, config);

//       // Refresh orders after cancellation
//       fetchOrders();
//       alert("Order cancelled successfully!");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to cancel order.");
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const config = { headers: getHeaders() };
//       await axios.post(`${API_BASE_URL}/api/admin/orders/${orderId}/status/${newStatus}`, null, config);

//       // Refresh orders after status update
//       fetchOrders();
//       alert("Order status updated successfully!");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update order status.");
//     }
//   };

//   const exportOrders = async () => {
//     try {
//       const config = { headers: getHeaders(), responseType: 'blob' };
//       // You'll need to implement an export endpoint in your backend
//       const res = await axios.get(`${API_BASE_URL}/api/admin/orders/export`, config);
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       alert("Failed to export orders.");
//     }
//   };

//   const refreshOrders = () => {
//     setIsRefreshing(true);
//     fetchOrders();
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "PENDING":
//         return <FaClock className="text-yellow-500" />;
//       case "DELIVERED":
//         return <FaCheckCircle className="text-green-500" />;
//       case "CANCELLED":
//         return <FaTimesCircle className="text-red-500" />;
//       default:
//         return <FaExclamationTriangle className="text-blue-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
//       case "DELIVERED":
//         return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
//       case "CANCELLED":
//         return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
//       default:
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
//     }
//   };

//   if (isLoading && !isRefreshing) {
//     return (
//       <div className="pt-20 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
//           <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Loading orders...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="pt-20 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
//           <div className="text-red-500 dark:text-red-400 mb-4 text-5xl">
//             <FaExclamationTriangle className="mx-auto" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unable to load orders</h3>
//           <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
//           <button
//             onClick={fetchOrders}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const stats = [
//     {
//       label: "Total Orders",
//       value: orders.totalElements,
//       color: "blue",
//       icon: <FaExclamationTriangle className="text-blue-500" />
//     },
//     {
//       label: "Pending",
//       value: orders.content.filter(o => o.orderStatus === "PENDING").length,
//       color: "yellow",
//       icon: <FaClock className="text-yellow-500" />
//     },
//     {
//       label: "Delivered",
//       value: orders.content.filter(o => o.orderStatus === "DELIVERED").length,
//       color: "green",
//       icon: <FaCheckCircle className="text-green-500" />
//     },
//     {
//       label: "Cancelled",
//       value: orders.content.filter(o => o.orderStatus === "CANCELLED").length,
//       color: "red",
//       icon: <FaTimesCircle className="text-red-500" />
//     }
//   ];

//   const statusOptions = [
//     { value: "all", label: "All Statuses" },
//     { value: "PENDING", label: "Pending" },
//     { value: "CONFIRMED", label: "Confirmed" },
//     { value: "PROCESSING", label: "Processing" },
//     { value: "SHIPPED", label: "Shipped" },
//     { value: "DELIVERED", label: "Delivered" },
//     { value: "CANCELLED", label: "Cancelled" }
//   ];

//   return (
//     <div className="pt-20 pb-10 px-4 md:px-6 ml-0 md:ml-80 transition-colors duration-300 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
//               Orders Management
//             </h2>
//             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//               Manage and track all customer orders
//             </p>
//           </div>

//           <div className="flex gap-3 flex-wrap">
//             <button
//               onClick={exportOrders}
//               className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
//             >
//               <FaDownload className="w-4 h-4" />
//               Export
//             </button>
//             <button
//               onClick={refreshOrders}
//               disabled={isRefreshing}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
//             >
//               <FaSync className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map(({ label, value, color, icon }) => (
//             <div
//               key={label}
//               className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{label}</h3>
//                   <p className={`mt-2 text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>
//                     {value}
//                   </p>
//                 </div>
//                 <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
//                   {icon}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Filters and Search */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search orders by ID, email, or name..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div className="flex gap-2">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FaFilter className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
//                 >
//                   {statusOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <button
//                 onClick={() => {
//                   setSearchQuery("");
//                   setStatusFilter("all");
//                   setPagination({ pageIndex: 0, pageSize: 20 });
//                 }}
//                 className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Orders Table */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
//           <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//             <h3 className="font-medium text-gray-700 dark:text-gray-300">
//               Orders ({orders.numberOfElements} of {orders.totalElements})
//             </h3>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               Page {orders.number + 1} of {orders.totalPages}
//             </span>
//           </div>

//           {/* Check if your Table component supports pagination props */}
//           <div className="dark:text-white">
//           <Table
//             data={orders.content || []}
//             fields={ordersColumns(cancelOrder, updateOrderStatus, getStatusIcon, getStatusColor)}
//             pageCount={orders.totalPages}
//             pagination={pagination}
//             onPaginationChange={handlePaginationChange}
//             enableTopToolBar={true}
//             enableBottomToolBar={true}
//             enablePagination={true}
//             enableRowSelection={false}
//             enableColumnFilters={true}
//             enableEditing={false}
//             enableColumnDragging={true}
//             enableSorting={true}
//             enableGlobalFilter={false}
//           />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Orders;

// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { ordersColumns } from "../../../data/ordersColumns";
// import Table from "../../../components/Table";
// import {
//   getAdminOrdersAPI,
//   updateAdminOrderStatusAPI,
//   cancelAdminOrderAPI,
// } from "../../../api/order";
// import {
//   FaSync,
//   FaFilter,
//   FaSearch,
//   FaExclamationTriangle,
//   FaCheckCircle,
//   FaClock,
//   FaCog,
//   FaBox,
//   FaMoneyBillWave,
// } from "react-icons/fa";

// const AdminOrders = () => {
//   const [ordersData, setOrdersData] = useState({
//     content: [],
//     totalElements: 0,
//     totalPages: 0,
//     number: 0,
//     size: 20,
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 20,
//   });

//   const fetchOrders = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const filters = {
//         status: statusFilter !== "all" ? statusFilter : undefined,
//         search: searchQuery || undefined,
//       };

//       const data = await getAdminOrdersAPI(
//         pagination.pageIndex,
//         pagination.pageSize,
//         filters
//       );

//       console.log("Admin orders data:", data); // Debug log
//       setOrdersData(data);
//     } catch (err) {
//       setError(err.message);
//       console.error("Failed to fetch orders:", err);
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   }, [pagination.pageIndex, pagination.pageSize, searchQuery, statusFilter]);

//   const handleCancelOrder = useCallback(
//     async (orderId) => {
//       if (!window.confirm("Are you sure you want to cancel this order?"))
//         return;

//       try {
//         await cancelAdminOrderAPI(orderId);
//         fetchOrders();
//       } catch (err) {
//         alert(err.message);
//       }
//     },
//     [fetchOrders]
//   );

//   const handleStatusUpdate = useCallback(
//     async (orderId, newStatus) => {
//       try {
//         await updateAdminOrderStatusAPI(orderId, newStatus);
//         fetchOrders();
//       } catch (err) {
//         alert(err.message);
//       }
//     },
//     [fetchOrders]
//   );

//   const refreshOrders = useCallback(() => {
//     setIsRefreshing(true);
//     setPagination((prev) => ({ ...prev, pageIndex: 0 }));
//   }, []);

//   const clearFilters = useCallback(() => {
//     setSearchQuery("");
//     setStatusFilter("all");
//     setPagination((prev) => ({ ...prev, pageIndex: 0 }));
//   }, []);

//   const columns = useMemo(
//     () => ordersColumns(handleCancelOrder, handleStatusUpdate, true),
//     [handleCancelOrder, handleStatusUpdate]
//   );

//   const stats = useMemo(
//     () => [
//       {
//         label: "Total Orders",
//         value: ordersData.totalElements,
//         color: "blue",
//         icon: <FaBox className="text-blue-500" />,
//       },
//       {
//         label: "Pending",
//         value: ordersData.content.filter((o) => o.orderStatus === "PENDING")
//           .length,
//         color: "yellow",
//         icon: <FaClock className="text-yellow-500" />,
//       },
//       {
//         label: "Processing",
//         value: ordersData.content.filter((o) => o.orderStatus === "PROCESSING")
//           .length,
//         color: "purple",
//         icon: <FaCog className="text-purple-500" />,
//       },
//       {
//         label: "Delivered",
//         value: ordersData.content.filter((o) => o.orderStatus === "DELIVERED")
//           .length,
//         color: "green",
//         icon: <FaCheckCircle className="text-green-500" />,
//       },
//       {
//         label: "Unpaid",
//         value: ordersData.content.filter(
//           (o) => o.paymentStatus === "PENDING" || o.paymentStatus === "UNPAID"
//         ).length,
//         color: "red",
//         icon: <FaMoneyBillWave className="text-red-500" />,
//       },
//     ],
//     [ordersData.content, ordersData.totalElements]
//   );

//   const statusOptions = useMemo(
//     () => [
//       { value: "all", label: "All Statuses" },
//       { value: "PENDING", label: "Pending" },
//       { value: "CONFIRMED", label: "Confirmed" },
//       { value: "PROCESSING", label: "Processing" },
//       { value: "DELIVERED", label: "Delivered" },
//       { value: "CANCELLED", label: "Cancelled" },
//       { value: "PAYMENT_FAILED", label: "Payment Failed" },
//     ],
//     []
//   );

//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   if (isLoading && !isRefreshing) {
//     return (
//       <div className="pt-20 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
//           <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
//             Loading orders...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="pt-20 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
//           <div className="text-red-500 dark:text-red-400 mb-4 text-5xl">
//             <FaExclamationTriangle className="mx-auto" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//             Unable to load orders
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
//           <button
//             onClick={refreshOrders}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-20 pb-10 px-4 md:px-6 ml-0 md:ml-80 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
//               Orders Management
//             </h2>
//             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//               Manage and track all customer orders
//             </p>
//           </div>

//           <button
//             onClick={refreshOrders}
//             disabled={isRefreshing}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg transition-all"
//           >
//             <FaSync
//               className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
//             />
//             Refresh
//           </button>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//           {stats.map(({ label, value, color, icon }) => (
//             <div
//               key={label}
//               className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
//                     {label}
//                   </h3>
//                   <p
//                     className={`mt-2 text-2xl font-bold text-${color}-600 dark:text-${color}-400`}
//                   >
//                     {value}
//                   </p>
//                 </div>
//                 <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
//                   {icon}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search orders by ID, email, name, or phone..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex gap-2 flex-wrap">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FaFilter className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {statusOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <button
//                 onClick={clearFilters}
//                 className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
//           <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//             <h3 className="font-medium text-gray-700 dark:text-gray-300">
//               Orders ({ordersData.content.length} of {ordersData.totalElements})
//             </h3>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               Page {ordersData.number + 1} of {ordersData.totalPages}
//             </span>
//           </div>

//           {ordersData.content.length > 0 ? (
//             <Table
//               data={ordersData.content}
//               fields={columns} // Changed from columns to fields
//               pageCount={ordersData.totalPages}
//               pagination={pagination}
//               onPaginationChange={({ pageIndex }) =>
//                 setPagination((prev) => ({ ...prev, pageIndex }))
//               }
//               enablePagination={true}
//               enableSorting={true}
//             />
//           ) : (
//             <div className="p-8 text-center">
//               <FaBox className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
//               <p className="text-gray-500 dark:text-gray-400">
//                 No orders found
//               </p>
//               <button
//                 onClick={clearFilters}
//                 className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
//               >
//                 Clear filters
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminOrders;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       import React, { useEffect, useState, useCallback, useMemo } from "react";
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
    <div className="pt-20 pb-10 px-4  ml-0  bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Orders Management
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage and track all customer orders
            </p>
          </div>

          <button
            onClick={refreshOrders}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg transition-all"
          >
            <FaSync
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map(({ label, value, color, icon }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {label}
                  </h3>
                  <p
                    className={`mt-2 text-2xl font-bold text-${color}-600 dark:text-${color}-400`}
                  >
                    {value}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, email, name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">
              Orders ({ordersData.content.length} of {ordersData.totalElements})
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {ordersData.number + 1} of {ordersData.totalPages}
            </span>
          </div>
          <div className="dark:text-white">
            {ordersData.content.length > 0 ? (
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
            ) : (
              <div className="p-8 text-center">
                <FaBox className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No orders found
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
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
