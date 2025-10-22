import React from 'react';

const OrderSummary = ({ cartItems, subTotal }) => {
  return (
    <div className="md:w-1/3 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm h-fit">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Items ({cartItems?.length})</span>
          <span>KSh {subTotal}</span>
        </div>
        <div className="flex justify-between text-green-600 dark:text-green-400">
          <span>Shipping</span>
          <span>FREE</span>
        </div>
        <hr className="my-3 border-gray-200 dark:border-gray-600" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>KSh {subTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;