import React from 'react';
import { FaMoneyBillWave, FaClock, FaBox, FaPhone } from 'react-icons/fa';

const CODConfirmation = ({ orderData, onConfirm, onBack, isLoading }) => {
  const {
    address,
    deliveryDate,
    deliveryTime,
    totalAmount,
    itemsCount
  } = orderData;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Confirm Cash on Delivery
      </h2>

      {/* Order Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Items:</span>
            <span>{itemsCount} item{itemsCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-semibold">KES {totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery:</span>
            <span>{new Date(deliveryDate).toLocaleDateString()} at {deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
          <FaBox className="w-4 h-4 mr-2" />
          Delivery Address
        </h3>
        <p className="text-blue-700 dark:text-blue-200">
          {address.county}, {address.estate}<br />
          {address.county}<br />
          {address.phoneNumber && (
            <span className="flex items-center mt-1">
              <FaPhone className="w-3 h-3 mr-1" />
              {address.phoneNumber}
            </span>
          )}
        </p>
      </div>

      {/* COD Instructions */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center">
          <FaMoneyBillWave className="w-4 h-4 mr-2" />
          Important COD Instructions
        </h3>
        <ul className="space-y-2 text-yellow-700 dark:text-yellow-300 text-sm">
          <li className="flex items-start">
            <FaClock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            Have exact money ready for KES {totalAmount}
          </li>
          <li className="flex items-start">
            <FaBox className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            Delivery within {new Date(deliveryDate).toLocaleDateString()} at {deliveryTime}
          </li>
          <li className="flex items-start">
            <FaPhone className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            You'll receive a confirmation call
          </li>
          <li className="flex items-start">
            <span className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0">•</span>
            Available only for Nairobi county
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Confirming...
            </>
          ) : (
            'Confirm COD Order'
          )}
        </button>
      </div>

      {/* Additional Info */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        By confirming, you agree to pay KES {totalAmount} in cash upon delivery
      </p>
    </div>
  );
};

export default CODConfirmation;