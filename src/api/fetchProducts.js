import axios from "axios";
import { API_BASE_URL, API_URLS } from "./constant";

const getAuthToken = () => {
    return localStorage.getItem("authToken");
};

const createAuthHeaders = () => {
    const token = getAuthToken();
    if (token) {
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }
    return {};
};

// Enhanced fetchProducts with pagination support
export const fetchProducts = async ({ 
    categoryId, 
    categoryCode, 
    typeId, 
    limit, 
    page = 0, 
    size = 20,
    search 
} = {}) => {
    let url = API_BASE_URL + API_URLS.GET_PRODUCTS;
    const params = new URLSearchParams();

    // Pagination parameters
    if (page !== undefined) params.append("page", page);
    if (size !== undefined) params.append("size", size);
    
    // Filter parameters
    if (categoryId) params.append("categoryId", categoryId);
    if (categoryCode) params.append("categoryCode", categoryCode);
    if (typeId) params.append("typeId", typeId);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);

    if (params.toString()) {
        url = url + `?` + params.toString();
    }

    try {
        const config = createAuthHeaders();
        const result = await axios.get(url, config);
        return result?.data;
    } catch (err) {
        console.error("Error fetching products:", err);
        throw err;
    }
};

// Get product count for pagination
export const getProductCount = async ({ categoryId, typeId, search } = {}) => {
    let url = API_BASE_URL + API_URLS.GET_PRODUCTS + "/count";
    const params = new URLSearchParams();

    if (categoryId) params.append("categoryId", categoryId);
    if (typeId) params.append("typeId", typeId);
    if (search) params.append("search", search);

    if (params.toString()) {
        url = url + `?` + params.toString();
    }

    try {
        const config = createAuthHeaders();
        const result = await axios.get(url, config);
        return result?.data?.count || 0;
    } catch (err) {
        console.error("Error fetching product count:", err);
        return 0;
    }
};

// Get single product by slug (updated response structure)
export const getProductBySlug = async (slug) => {
    const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?slug=${slug}`;
    try {
        const config = createAuthHeaders();
        const result = await axios.get(url, config);
        // Updated to match new response structure
        return result?.data?.products?.[0] || result?.data?.[0];
    } catch (err) {
        console.error("Error fetching product by slug:", err);
        throw err;
    }
};

// Get product by ID
export const getProductById = async (id) => {
    const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `/${id}`;
    try {
        const config = createAuthHeaders();
        const result = await axios.get(url, config);
        return result?.data;
    } catch (err) {
        console.error("Error fetching product by ID:", err);
        throw err;
    }
};

// export const fetchFeaturedProducts = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/products`);
//     // Filter featured products client-side until backend endpoint is ready
//     const products = response.data.products || response.data || [];
//     return products.filter(product => 
//       product.isFeatured && 
//       (!product.featuredUntil || new Date(product.featuredUntil) > new Date())
//     );
//   } catch (error) {
//     console.error('Error fetching featured products:', error);
//     throw error;
//   }
// };

// export const featureProduct = async (productId, data) => {
//   try {
//     const response = await axios.put(
//       `${API_BASE_URL}/products/${productId}/feature`,
//       data,
//       { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error featuring product:', error);
//     throw error;
//   }
// };

// export const unfeatureProduct = async (productId) => {
//   try {
//     const response = await axios.put(
//       `${API_BASE_URL}/products/${productId}/unfeature`,
//       {},
//       { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error unfeaturing product:', error);
//     throw error;
//   }
// };

// export const getFeaturedProducts = async (page = 0, size = 100) => {
//   try {
//     const response = await api.get('/products/featured', {
//       params: { page, size }
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const fetchFeaturedProducts = async () => {
  try {
    const config = createAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/api/products`, config);
    // Filter featured products client-side until backend endpoint is ready
    const products = response.data.products || response.data || [];
    return products.filter(product => 
      product.isFeatured && 
      (!product.featuredUntil || new Date(product.featuredUntil) > new Date())
    );
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

export const featureProduct = async (productId, data) => {
  try {
    const config = createAuthHeaders();
    const response = await axios.put(
      `${API_BASE_URL}/api/products/${productId}/feature`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error featuring product:', error);
    
    // Check if it's an authentication error
    if (error.response?.status === 401) {
      // Check if user is admin
      const token = getAuthToken();
      if (token) {
        try {
          const jwtDecode = require('jwt-decode');
          const decoded = jwtDecode(token);
          const authorities = decoded.authorities || [];
          if (!authorities.includes("ROLE_ADMIN")) {
            throw new Error("You need ADMIN role to feature products");
          }
        } catch (decodeError) {
          console.error("Token decode error:", decodeError);
        }
      }
      throw new Error("Authentication failed. Please log in as admin.");
    }
    
    throw error;
  }
};

export const unfeatureProduct = async (productId) => {
  try {
   console.log('🚀 Unfeature Product Request:', {
      url: `${API_BASE_URL}/api/products/${productId}/unfeature`,
      productId,
      timestamp: new Date().toISOString()
    });

    const config = createAuthHeaders();
    console.log('📨 Sending unfeature request with config:', config);

    // Try with and without empty body
    const response = await axios.put(
      `${API_BASE_URL}/api/products/${productId}/unfeature`,
      {},  // Empty object as body
      config
    );
    
    console.log('✅ Unfeature Product Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Unfeature Product Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      requestUrl: error.config?.url,
      requestMethod: error.config?.method,
      requestHeaders: error.config?.headers,
      message: error.message
    })};
    
};

export const getFeaturedProductsPaginated = async (page = 0, size = 100) => {
  try {
    const config = createAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/api/products/featured`, {
      ...config,
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};