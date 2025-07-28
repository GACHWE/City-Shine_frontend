// import axios from "axios";
// import { API_BASE_URL, API_URLS } from "./constant";


// // This function now retrieves the token from localStorage
// const getAuthToken = () => {
//     return localStorage.getItem("authToken"); 
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
//         const result = await axios(url, {
//             method: "GET",
//             headers: {
//                 // This line now correctly gets the token from localStorage
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
//                 // This line now correctly gets the token from localStorage
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

import axios from "axios"; // <-- UNCOMMENT THIS LINE
import { API_BASE_URL, API_URLS } from "./constant"; // <-- UNCOMMENT THIS LINE


// This function now retrieves the token from localStorage
const getAuthToken = () => {
    const token = localStorage.getItem("authToken"); 
    console.log("Token retrieved from localStorage (getAuthToken):", token); // Added for debugging
    return token; 
};


export const getAllProducts = async (id, typeId) => {
    let url = API_BASE_URL + API_URLS.GET_PRODUCTS;
    const params = new URLSearchParams();

    if (id) {
        params.append("categoryId", id);
    }
    if (typeId) {
        params.append("typeId", typeId);
    }

    if (params.toString()) {
        url = url + `?` + params.toString();
    }

    try {
        console.log("Attempting to fetch products with token:", getAuthToken()); // Added for debugging
        const result = await axios(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return result?.data;
    } catch (err) {
        console.error("Error fetching products:", err);
        throw err;
    }
};

export const getProductBySlug = async (slug) => {
    const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?slug=${slug}`;
    try {
        const result = await axios(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return result?.data?.[0];
    } catch (err) {
        console.error("Error fetching product by slug:", err);
        throw err;
    }
};