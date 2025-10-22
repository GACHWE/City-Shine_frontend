// src/api/fetchCategories.js
import axios from "axios";
import { API_BASE_URL, API_URLS } from "./constant";
import store from "../store/store";
import { setLoading, setError } from "../store/features/common";

export const getAllCategories = async () => {
  const url = `${API_BASE_URL}${API_URLS.GET_CATEGORIES}`;

  store.dispatch(setLoading(true));

  try {
    const res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!Array.isArray(res?.data)) {
      throw new Error("Invalid categories response format");
    }

    store.dispatch(setError(null));
    return res.data;
  } catch (err) {
    console.error("Error fetching categories:", err);
    store.dispatch(setError("Failed to fetch categories. Please try again."));
    return [];
  } finally {
    store.dispatch(setLoading(false));
  }
};
