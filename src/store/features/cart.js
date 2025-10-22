// store/features/cart.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

export const getUniqueKey = (productId, variantId) =>
  `${productId}-${variantId ?? "default"}`;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const uniqueKey = getUniqueKey(item.productId, item.variantId);
      const existingItem = state.cart.find((p) => p.uniqueKey === uniqueKey);

      if (existingItem) {
        existingItem.quantity += item.quantity ?? 1;
      } else {
        state.cart.push({
          ...item,
          quantity: item.quantity ?? 1,
          uniqueKey,
        });
      }
    },

    updateQuantity: (state, action) => {
      const { productId, variantId, change } = action.payload;
      const uniqueKey = getUniqueKey(productId, variantId);
      const item = state.cart.find((p) => p.uniqueKey === uniqueKey);

      if (item) {
        const newQty = item.quantity + change;
        if (newQty >= 1 && newQty <= 10) {
          item.quantity = newQty;
        }
      }
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((p) => p.uniqueKey !== action.payload);
    },

    deleteCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, deleteCart } =
  cartSlice.actions;

export const countCartItems = (state) =>
  state.cartState.cart.reduce((total, item) => total + item.quantity, 0);

export const selectCartItems = (state) => state.cartState.cart;

export default cartSlice.reducer;
