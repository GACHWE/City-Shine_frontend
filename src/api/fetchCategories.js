// src/api/fetchCategories.js
import axios from 'axios';
import { API_BASE_URL, API_URLS } from './constant';
import store from '../store/store'; // Import your Redux store directly
import { setLoading, setError } from '../store/features/common'; // Assuming common slice has setError

export const getAllCategories = async () => {
  const url = `${API_BASE_URL}${API_URLS.GET_CATEGORIES}`;

  store.dispatch(setLoading(true)); // Dispatch loading start

  try {
    const res = await axios.get(url);
    store.dispatch(setError(null)); // Clear any previous errors on success
    return res?.data;
  } catch (err) {
    console.error("Error fetching categories:", err);
    store.dispatch(setError("Failed to fetch categories. Please try again.")); // Set a descriptive error
    throw err; // Re-throw the error so calling contexts can handle it if needed
  } finally {
    store.dispatch(setLoading(false)); // Dispatch loading end
  }
};