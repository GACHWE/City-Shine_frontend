// import axios from "axios";
// import { API_BASE_URL, getHeaders } from "./constant";

// // Base API call function
// const apiCall = async (method, endpoint, data = null) => {
//   try {
//     const config = {
//       method,
//       url: `${API_BASE_URL}${endpoint}`,
//       headers: getHeaders(),
//       ...(data && { data }),
//       ...(method === 'get' && { params: data }),
//     };

//     if (method === 'post' && endpoint === '/api/orders') {
//       config.timeout = 30000;
//     }

//     const response = await axios(config);
//     return response.data;
//   } catch (error) {
//     const errorMessage = error.response?.data?.error ||
//                          error.response?.data?.message ||
//                          error.message ||
//                          "API request failed";
//     throw new Error(errorMessage);
//   }
// };

// // ==================== ADMIN API METHODS ====================

//  const getAdminOrdersAPI = async (page = 0, size = 20, filters = {}) => {
//   const params = { page, size, ...filters };
//   return apiCall('get', '/api/admin/orders', params);
// };

//  const getAdminOrderDetailsAPI = async (orderId) => {
//   return apiCall('get', `/api/admin/orders/${orderId}`);
// };

//  const updateAdminOrderStatusAPI = async (orderId, status) => {
//   const validStatuses = ['processing', 'delivered'];
//   const statusPath = status.toLowerCase();

//   if (!validStatuses.includes(statusPath)) {
//     throw new Error(`Unsupported status update: ${status}`);
//   }

//   return apiCall('post', `/api/admin/orders/${orderId}/${statusPath}`);
// };

//  const cancelAdminOrderAPI = async (orderId) => {
//   return apiCall('post', `/api/admin/orders/${orderId}/cancel`);
// };

// // ==================== CUSTOMER API METHODS ====================

//  const getCustomerOrdersAPI = async (page = 0, size = 10) => {
//   return apiCall('get', '/api/orders/user', { page, size });
// };

//  const placeOrderAPI = async (orderData) => {
//   return apiCall('post', '/api/orders', orderData);
// };

//  const cancelCustomerOrderAPI = async (orderId) => {
//   return apiCall('post', `/api/orders/${orderId}/cancel`);
// };

// // ==================== SHARED API METHODS ====================

//  const confirmPaymentAPI = async (orderId, paymentDetails) => {
//   return apiCall('post', `/api/orders/${orderId}/confirm-payment`, paymentDetails);
// };

//  const checkPaymentStatusAPI = async (orderId, checkoutRequestId) => {
//   return apiCall('get', `/api/orders/${orderId}/payment-status`, { checkoutRequestId });
// };

// // ==================== UTILITY FUNCTIONS ====================

//  const validateCodEligibility = (county) => {
//   return county && county.toLowerCase() === "nairobi";
// };

//  const formatKenyanPhoneNumber = (phone) => {
//   if (!phone) return "";
//   const digits = phone.replace(/\D/g, "");

//   if (digits.startsWith("0") && digits.length === 10) {
//     return "254" + digits.substring(1);
//   }
//   if (digits.startsWith("254") && digits.length === 12) {
//     return digits;
//   }
//   if (digits.length === 9) {
//     return "254" + digits;
//   }
//   return digits;
// };

//  const detectOrderRole = (orderData) => {
//   return orderData.customerEmail !== undefined ? 'admin' : 'customer';
// };

// // ==================== EXPORTS ====================

// // Export all individual methods
// export {
//   getAdminOrdersAPI,
//   getAdminOrderDetailsAPI,
//   updateAdminOrderStatusAPI,
//   cancelAdminOrderAPI,
//   getCustomerOrdersAPI,
//   placeOrderAPI,
//   cancelCustomerOrderAPI,
//   confirmPaymentAPI,
//   checkPaymentStatusAPI,
//   validateCodEligibility,
//   formatKenyanPhoneNumber,
//   detectOrderRole
// };

// // Export role-based collections
// export const AdminOrderAPI = {
//   getOrders: getAdminOrdersAPI,
//   getOrderDetails: getAdminOrderDetailsAPI,
//   updateStatus: updateAdminOrderStatusAPI,
//   cancelOrder: cancelAdminOrderAPI
// };

// export const CustomerOrderAPI = {
//   getOrders: getCustomerOrdersAPI,
//   placeOrder: placeOrderAPI,
//   cancelOrder: cancelCustomerOrderAPI,
//   confirmPayment: confirmPaymentAPI,
//   checkPaymentStatus: checkPaymentStatusAPI
// };

// // Default export
// export default {
//   Admin: AdminOrderAPI,
//   Customer: CustomerOrderAPI,
//   validateCod: validateCodEligibility,
//   formatPhone: formatKenyanPhoneNumber
// };
import axios from "axios";
import { API_BASE_URL } from "./constant";
import { getAuthToken } from "../utils/jwt-helper"; // Import your auth functions

const apiCall = async (method, endpoint, data = null, params = null, requiresAuth = true) => {
  try {
    const token = getAuthToken(); // Use your existing function
    
    if (requiresAuth && !token) {
      throw new Error("Authentication required. Please log in to access this resource.");
    }

    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(data && { data }),
      ...(params && { params }),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    const err = {
      message: error.response?.data?.message || error.message || "Request failed",
      status: error.response?.status,
    };
    throw err;
  }
};

// Rest of your exports remain the same...
export const getOrdersAPI = async (page = 0, size = 10, orderStatus = null) => {
  const params = { page, size, ...(orderStatus && { orderStatus }) };
  return apiCall("get", "/api/orders", null, params, true);
};

export const getOrderByIdAPI = async (orderId) => {
  return apiCall("get", `/api/orders/${orderId}`, null, null, true);
};

export const markAsProcessingAPI = async (orderId) => {
  if (!orderId) throw new Error("Invalid order ID");
  return apiCall("post", `/api/orders/${orderId}/processing`, null, null, true);
};

export const markAsDeliveredAPI = async (orderId) => {
  if (!orderId) throw new Error("Invalid order ID");
  return apiCall("post", `/api/orders/${orderId}/delivered`, null, null, true);
};

export const cancelOrderAPI = async (orderId) => {
  if (!orderId) throw new Error("Invalid order ID");
  return apiCall("post", `/api/orders/${orderId}/cancel`, null, null, true);
};

export const placeOrderAPI = async (orderData) => {
  return apiCall("post", "/api/orders", orderData, null, true);
};

export const getAdminOrdersAPI = async (page = 0, size = 20, filters = {}) => {
  const params = { page, size, ...filters };
  return apiCall("get", "/api/orders", null, params, true);
};

export const getCustomerOrdersAPI = async (page = 0, size = 10, orderStatus = null) => {
  return getOrdersAPI(page, size, orderStatus);
};

export const validateCodEligibility = (county) => {
  return county && county.toLowerCase() === "nairobi";
};

export const checkPaymentStatusAPI = async (checkoutRequestId) => {
  return apiCall("get", `/api/payments/status/${checkoutRequestId}`, null, null, true);
};

export const initiateStkPushAPI = async (orderId, phoneNumber, amount) => {
  return apiCall("post", "/api/payments/stk-push", {
    orderId,
    phoneNumber,
    amount: amount.toString(),
  }, null, true);
};