import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartItems } from "../../store/features/cart";
import { formatCurrency, formatDate, formatOrderId } from "../../utils/format";

const OrderConfirmed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);

  const { orderId, paymentMethod, amount, deliveryDate, deliveryTime, items } =
    location.state || {};

  const handleContinueShopping = () => navigate("/");
  const handleViewOrder = () => navigate("/account-details/orders");

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-yellow-500 dark:text-yellow-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn't find your order details. Please check your order history or
            contact support.
          </p>
          <button
            onClick={handleContinueShopping}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center mb-6">
          <div className="text-green-500 dark:text-green-400 mb-4">
            <svg
              className="w-20 h-20 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Thank you for shopping with us!
          </p>
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            Your order has been successfully placed and{" "}
            {paymentMethod === "COD" ? "will be processed" : "payment confirmed"}.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Order Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                ORDER NUMBER
              </h3>
              <p className="text-lg font-mono text-gray-800 dark:text-white">
                {formatOrderId(orderId)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                PAYMENT METHOD
              </h3>
              <div className="flex items-center">
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                  {paymentMethod || "M-Pesa"}
                </span>
              </div>
            </div>
            {amount && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  TOTAL AMOUNT
                </h3>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {formatCurrency(amount)}
                </p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                ITEMS ORDERED
              </h3>
              <p className="text-lg text-gray-800 dark:text-white">
                {items || cartItems.length} item{items || cartItems.length !== 1 ? "s" : ""}
              </p>
            </div>
            {deliveryDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  EXPECTED DELIVERY
                </h3>
                <p className="text-lg text-gray-800 dark:text-white">
                  {formatDate(deliveryDate)} {deliveryTime ? `at ${deliveryTime}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>

        {paymentMethod === "COD" && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
              Cash on Delivery Instructions
            </h3>
            <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
              <li>• Please have exact change of {formatCurrency(amount)} ready</li>
              <li>• You'll receive a confirmation call before delivery</li>
            </ul>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
            What's Next?
          </h3>
          <ul className="space-y-2 text-blue-700 dark:text-blue-300">
            <li className="flex items-center">
              <span className="w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3">
                1
              </span>
              You will receive an order confirmation call shortly
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3">
                2
              </span>
              We'll notify you when your order ships
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3">
                3
              </span>
              Track your order in your account dashboard
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleContinueShopping}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleViewOrder}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View My Orders
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help?{" "}
            <a
              href="/contact"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmed;