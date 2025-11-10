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

export const markAsConfirmedAPI = async (orderId) => {
  if (!orderId) throw new Error("Invalid order ID");
  return apiCall("post", `/api/orders/${orderId}/confirmed`, null, null, true);
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