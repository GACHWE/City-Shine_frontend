// // import axios from "axios";
// // import { API_BASE_URL, API_URLS } from "./constant";


// // // This function now retrieves the token from localStorage
// // const getAuthToken = () => {
// //     return localStorage.getItem("authToken"); 
// // };


// // export const getAllProducts = async (id, typeId) => {
// //     let url = API_BASE_URL + API_URLS.GET_PRODUCTS;
// //     const params = new URLSearchParams();

// //     if (id) {
// //         params.append("categoryId", id);
// //     }
// //     if (typeId) {
// //         params.append("typeId", typeId);
// //     }

// //     if (params.toString()) {
// //         url = url + `?` + params.toString();
// //     }

// //     try {
// //         const result = await axios(url, {
// //             method: "GET",
// //             headers: {
// //                 // This line now correctly gets the token from localStorage
// //                 Authorization: `Bearer ${getAuthToken()}`,
// //             },
// //         });
// //         return result?.data;
// //     } catch (err) {
// //         console.error("Error fetching products:", err);
// //         throw err;
// //     }
// // };

// // export const getProductBySlug = async (slug) => {
// //     const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?slug=${slug}`;
// //     try {
// //         const result = await axios(url, {
// //             method: "GET",
// //             headers: {
// //                 // This line now correctly gets the token from localStorage
// //                 Authorization: `Bearer ${getAuthToken()}`,
// //             },
// //         });
// //         return result?.data?.[0];
// //     } catch (err) {
// //         console.error("Error fetching product by slug:", err);
// //         throw err;
// //     }
// // };

// // src/api/fetchProducts.js

// import axios from "axios"; // <-- UNCOMMENT THIS LINE
// import { API_BASE_URL, API_URLS } from "./constant"; // <-- UNCOMMENT THIS LINE


// // This function now retrieves the token from localStorage
// const getAuthToken = () => {
//     const token = localStorage.getItem("authToken"); 
//     console.log("Token retrieved from localStorage (getAuthToken):", token); // Added for debugging
//     return token; 
// };


// export const getAllProducts = async (id, typeId) => {
//     let url = API_BASE_URL + API_URLS.GET_PRODUCTS;
//     const params = new URLSearchParams();

//     if (id) {
//         params.append("categoryId", id);
//     }
//     if (typeId) {
//         params.append("typeId", typeId);
//     }

//     if (params.toString()) {
//         url = url + `?` + params.toString();
//     }

//     try {
//         console.log("Attempting to fetch products with token:", getAuthToken()); // Added for debugging
//         const result = await axios(url, {
//             method: "GET",
//             headers: {
//                 Authorization: `Bearer ${getAuthToken()}`,
//             },
//         });
//         return result?.data;
//     } catch (err) {
//         console.error("Error fetching products:", err);
//         throw err;
//     }
// };

// export const getProductBySlug = async (slug) => {
//     const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?slug=${slug}`;
//     try {
//         const result = await axios(url, {
//             method: "GET",
//             headers: {
//                 Authorization: `Bearer ${getAuthToken()}`,
//             },
//         });
//         return result?.data?.[0];
//     } catch (err) {
//         console.error("Error fetching product by slug:", err);
//         throw err;
//     }
// };

// src/api/fetchProducts.js

// src/api/fetchProducts.js
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