// store/features/common.js
import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "common",
  initialState: {
    loading: false,
    error: null,
    toast: {
      show: false,
      message: "",
      type: "info", // 'info', 'success', 'warning', 'error'
      duration: 3000 // milliseconds
    }
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    showToast: (state, action) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || "info",
        duration: action.payload.duration || 3000
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
    clearToast: (state) => {
      state.toast = {
        show: false,
        message: "",
        type: "info",
        duration: 3000
      };
    }
  }
});

// ✅ Export all actions
export const { 
  setLoading, 
  setError, 
  showToast, 
  hideToast, 
  clearToast 
} = commonSlice.actions;

// ✅ Selectors
export const selectLoading = (state) => state.common.loading;
export const selectError = (state) => state.common.error;
export const selectToast = (state) => state.common.toast;

// ✅ Reducer
export default commonSlice.reducer;