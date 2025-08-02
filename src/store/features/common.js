// src/store/features/common.js
import { createSlice } from "@reduxjs/toolkit"

export const initialState = {
    loading: false,
    error: null // <-- ADD THIS LINE: Initialize an error state
}

export const commonSlice = createSlice({
    name:'commonSlice',
    initialState,
    reducers:{
        setLoading : (state,action)=>{
            // Redux Toolkit uses Immer, so direct mutation is fine and preferred for simplicity
            state.loading = action.payload; // <-- SIMPLIFIED: Direct mutation
        },
        setError : (state,action)=>{ // <-- ADD THIS REDUCER: To set error messages
            state.error = action.payload; // <-- Set the error message from action.payload
        }
    }
});

// <-- IMPORTANT: Export both setLoading AND setError
export const { setLoading, setError } = commonSlice?.actions;
export default commonSlice?.reducer;