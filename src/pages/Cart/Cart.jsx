// pages/Cart/Cart.jsx
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems } from "../../store/features/cart";
import {
  deleteItemFromCartAction,
  updateItemToCartAction,
} from "../../store/actions/cartAction";
import DeleteIcon from "../../components/common/DeleteIcon";
import Modal from "react-modal";
import { customStyles } from "../../styles/modal";
import { isTokenValid } from "../../utils/jwt-helper";
import { Link, useNavigate } from "react-router-dom";
import EmptyCart from "../../assets/img/empty_cart.png";

const formatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});

  const onDeleteProduct = useCallback((uniqueKey, name) => {
    setDeleteItem({ uniqueKey, name });
    setModalIsOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setDeleteItem({});
    setModalIsOpen(false);
  }, []);

  const onDeleteItem = useCallback(() => {
    dispatch(deleteItemFromCartAction(deleteItem.uniqueKey, deleteItem.name));
    setModalIsOpen(false);
  }, [deleteItem, dispatch]);

  // IMPORTANT: this assumes your reducer uses "change" steps (+1/-1)
  const inc = useCallback(
    (productId, variantId) => {
      dispatch(updateItemToCartAction(productId, variantId, +1));
    },
    [dispatch]
  );

  const dec = useCallback(
    (productId, variantId) => {
      dispatch(updateItemToCartAction(productId, variantId, -1));
    },
    [dispatch]
  );

  React.useEffect(() => {
    console.log('Cart items structure:', cartItems);
  }, [cartItems]);
  // const subTotal = useMemo(() => {
  //   return cartItems.reduce(
  //     (total, item) => total + item.price * item.quantity,
  //     0
  //   );
  // }, [cartItems]);
   const subTotal = useMemo(() => {
    console.log('Calculating subtotal with items:', cartItems.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })));
    
    return cartItems.reduce(
      (total, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return total + (price * quantity);
      },
      0
    );
  }, [cartItems]);

  const isLoggedIn = useMemo(() => isTokenValid(), []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 sm:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
          🛒 Your Shopping Bag
        </h1>

        {!cartItems || cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-center">
            <img src={EmptyCart} alt="empty-cart" className="w-40 h-40 mb-4" />
            <p className="text-xl font-semibold mb-1">Your cart is empty</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Add items you like to make it happy
            </p>
            <Link
              to="/"
              className="bg-black dark:bg-white text-white dark:text-black font-semibold py-3 px-8 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => {
                // Use the stored variantId on the cart item itself
                const variantId = item.variantId ?? "default";

                return (
                  <div
                    key={item.uniqueKey}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-lg transition-shadow flex flex-col sm:flex-row items-center gap-4"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold">{item.name}</p>
                      {item.variant && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Size: {item.variant.size} | Color:{" "}
                          {item.variant.color}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => dec(item.productId, variantId)}
                          disabled={item.quantity <= 1}
                          className={`px-3 py-1 rounded-full text-lg font-bold transition
                            ${
                              item.quantity <= 1
                                ? "bg-gray-200 dark:bg-gray-700 opacity-60 cursor-not-allowed"
                                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95"
                            }
                          `}
                          aria-label="Decrease quantity"
                          title="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="px-3 py-1 min-w-[2.5rem] text-center bg-gray-100 dark:bg-gray-600 rounded-full font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => inc(item.productId, variantId)}
                          disabled={item.quantity >= 10}
                          className={`px-3 py-1 rounded-full text-lg font-bold transition
                            ${
                              item.quantity >= 10
                                ? "bg-gray-200 dark:bg-gray-700 opacity-60 cursor-not-allowed"
                                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95"
                            }
                          `}
                          aria-label="Increase quantity"
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-semibold">
                        {formatter.format(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteProduct(item.uniqueKey, item.name)}
                      className="p-2 bg-red-400 hover:bg-red-500 dark:hover:bg-red-300  rounded-full transition"
                      aria-label="Remove from cart"
                      title="Remove from cart"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg sticky top-20 h-fit">
              <p className="text-xl font-bold mb-4 border-b pb-4">
                Order Summary
              </p>

              <div className="flex justify-between mb-2">
                <p className="text-gray-600 dark:text-gray-300">Subtotal</p>
                <p className="font-semibold">{formatter.format(subTotal)}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-gray-600 dark:text-gray-300">Shipping</p>
                <p className="font-semibold text-green-600">FREE</p>
              </div>

              <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
                <p>Grand Total</p>
                <p>{formatter.format(subTotal)}</p>
              </div>

              <div className="mt-6">
                {isLoggedIn ? (
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <Link
                    to="/v1/login"
                    className="block text-center w-full py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
                  >
                    Login to Checkout
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        contentLabel="Remove Item"
        className=""
      >
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg max-w-sm w-full text-center">
          <p className="text-lg font-semibold mb-6">
            Remove <span className="text-red-500">{deleteItem.name}</span> from
            your cart?
          </p>
          <div className="flex gap-4">
            <button
              onClick={onCloseModal}
              className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onDeleteItem}
              className="flex-1 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
