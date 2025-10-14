// store/actions/cartAction.js
import {
  addToCart,
  deleteCart,
  removeFromCart,
  updateQuantity,
} from "../features/cart";
import toast from "react-hot-toast";

export const addItemToCartAction = (productItem) => (dispatch) => {
  dispatch(
    addToCart({
      ...productItem,
      variantId: productItem.variantId ?? "default",
    })
  );
  toast.success(`${productItem.name} added to cart`);
};

export const updateItemToCartAction = (productId, variantId, change) => (dispatch) => {
  dispatch(
    updateQuantity({
      productId,
      variantId: variantId ?? "default",
      change,
    })
  );
};

export const deleteItemFromCartAction = (uniqueKey, name) => (dispatch) => {
  dispatch(removeFromCart(uniqueKey));
  toast.success(`${name} removed from cart`);
};

export const clearCart = () => (dispatch) => {
  dispatch(deleteCart());
  toast.success("Cart cleared");
};
