// import React from 'react';
// import { useOrderStatus } from './OrderStatusBadge';

// export const OrderActions = ({ 
//   order, 
//   onStatusUpdate, 
//   onCancel,
//   isLoading = false,
//   isAdmin = false,
//   className = '' 
// }) => {
//   const { canCancel, canProcess, canDeliver } = useOrderStatus();
  
//   const handleAction = async (action, value) => {
//     try {
//       if (action === 'status' && onStatusUpdate) {
//         await onStatusUpdate(value);
//       } else if (action === 'cancel' && onCancel) {
//         await onCancel();
//       }
//     } catch (error) {
//       console.error('Action failed:', error);
//     }
//   };

//   const status = order?.orderStatus || order?.status;
//   const orderId = order?.orderId || order?.id;

//   if (!orderId || !status) {
//     return (
//       <div className={`text-center text-gray-500 ${className}`}>
//         Unable to load actions
//       </div>
//     );
//   }

//   const actionsAvailable = canCancel(status) || (isAdmin && (canProcess(status) || canDeliver(status)));

//   if (!actionsAvailable) {
//     return (
//       <div className={`text-center text-gray-500 ${className}`}>
//         No actions available
//       </div>
//     );
//   }

//   return (
//     <div className={`flex flex-wrap gap-2 ${className}`}>
//       {canCancel(status) && (
//         <button
//           onClick={() => handleAction('cancel')}
//           disabled={isLoading}
//           className={`
//             bg-red-600 hover:bg-red-700 disabled:bg-red-400 
//             text-white px-3 py-1.5 rounded text-xs font-medium
//             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500
//             min-w-[80px] flex items-center justify-center
//           `}
//           title="Cancel this order"
//         >
//           {isLoading ? '...' : 'Cancel'}
//         </button>
//       )}

//       {isAdmin && canProcess(status) && (
//         <button
//           onClick={() => handleAction('status', 'PROCESSING')}
//           disabled={isLoading}
//           className={`
//             bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 
//             text-white px-3 py-1.5 rounded text-xs font-medium
//             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500
//             min-w-[100px] flex items-center justify-center
//           `}
//           title="Mark as Processing"
//         >
//           {isLoading ? '...' : 'Process'}
//         </button>
//       )}

//       {isAdmin && canDeliver(status) && (
//         <button
//           onClick={() => handleAction('status', 'DELIVERED')}
//           disabled={isLoading}
//           className={`
//             bg-green-600 hover:bg-green-700 disabled:bg-green-400 
//             text-white px-3 py-1.5 rounded text-xs font-medium
//             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500
//             min-w-[100px] flex items-center justify-center
//           `}
//           title="Mark as Delivered"
//         >
//           {isLoading ? '...' : 'Deliver'}
//         </button>
//       )}
//     </div>
//   );
// };

// export default OrderActions;