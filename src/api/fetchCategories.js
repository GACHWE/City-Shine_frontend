// // src/api/fetchCategories.js
// import axios from "axios";
// import { API_BASE_URL, API_URLS } from "./constant";

// export const getAllCategories = async () => {
//   const url = API_BASE_URL + API_URLS.GET_CATEGORIES;
//   const response = await axios.get(url);
//   return response.data;
// };

// fetchCategories.js
import axios from 'axios';
import { API_BASE_URL, API_URLS } from './constant';

export const getAllCategories = async () => {
  const url = `${API_BASE_URL}${API_URLS.GET_CATEGORIES}`;
  try {
    const res = await axios.get(url);
    return res?.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
