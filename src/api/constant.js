import { getToken } from "../utils/jwt-helper";
export const API_URLS = {
  GET_PRODUCTS: "/api/products",
  GET_PRODUCT: (id) => `/api/product/${id}`,
  GET_CATEGORIES: "/api/category",
  GET_CATEGORY: (id) => `/api/category/${id}`,
  GET_ORDERS: "/api/admin/orders",
  CANCEL_ORDER: (id) => `/api/admin/orders/${id}/cancel`,
};

export const API_BASE_URL = "https://cityshine-backend-production.up.railway.app";

export const getHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
};
