import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../store/features/cart';
import { placeOrderAPI } from '../../api/orderApi';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ userId, addressId, deliveryDate, deliveryTime }) => {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const formatPhoneNumber = useCallback((phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0') && digits.length === 10) {
      return '254' + digits.substring(1);
    }
    if (digits.startsWith('254') && digits.length === 12) {
      return digits;
    }
    if (digits.length === 9) {
      return '254' + digits;
    }
    return digits;
  }, []);

  const validatePhoneNumber = useCallback((phone) => {
    const digits = phone.replace(/\D/g, '');
    return (digits.startsWith('254') && digits.length === 12) || 
           (digits.startsWith('0') && digits.length === 10) ||
           digits.length === 9;
  }, []);

  const handleMpesaPayment = async () => {
    if (!userId || !addressId || !deliveryDate || !deliveryTime) {
      setError('Please complete all delivery information');
      return;
    }

    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number (07XXX or 7XXX)');
      return;
    }

    setIsLoading(true);
    setError('');

    // Set timeout for payment initiation
    const paymentTimeout = setTimeout(() => {
      setIsLoading(false);
      setError('Payment initiation timed out. Please try again.');
    }, 30000);

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        productVariantId: item.variantId || null,
        quantity: item.quantity,
        discount: item.discount || 0
      }));

      const deliveryDateTime = new Date(deliveryDate);
      const [startTime] = deliveryTime.split(' - ');
      const [hours] = startTime.split(':');
      deliveryDateTime.setHours(parseInt(hours), 0, 0, 0);

      const orderRequest = {
        userId,
        addressId,
        orderItemRequests: orderItems,
        totalAmount: cartTotal,
        discount: cartItems.reduce((total, item) => total + (item.discount || 0), 0),
        paymentMethod: 'MPESA',
        expectedDeliveryDate: deliveryDateTime.toISOString(),
        phoneNumber: formatPhoneNumber(phoneNumber),
        orderDate: new Date().toISOString()
      };

      const response = await placeOrderAPI(orderRequest);
      
      // Validate response
      if (!response || !response.orderId || !response.checkoutRequestId) {
        throw new Error('Invalid response from payment service');
      }
      
      if (response.paymentStatus === 'PENDING') {
        navigate('/payment-pending', { 
          state: { 
            orderId: response.orderId,
            checkoutRequestId: response.checkoutRequestId,
            phoneNumber: formatPhoneNumber(phoneNumber),
            amount: cartTotal
          } 
        });
      } else if (response.paymentStatus === 'COMPLETED') {
        navigate('/order-confirmed', {
          state: {
            orderId: response.orderId,
            amount: cartTotal,
            paymentMethod: 'M-Pesa'
          },
          replace: true
        });
      } else {
        setError(response.paymentMessage || 'Payment initiation failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to process payment. Please try again.';
      setError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      clearTimeout(paymentTimeout);
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      if (error && error.includes('phone')) {
        setError('');
      }
    }
  };

  const isFormValid = userId && addressId && deliveryDate && deliveryTime && 
                     phoneNumber && validatePhoneNumber(phoneNumber);

  return (
    <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        M-Pesa Payment
      </h3>
      
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          M-Pesa Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">+254</span>
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="7XX XXX XXX"
            className="w-full pl-14 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            maxLength={9}
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Enter your Safaricom M-Pesa number (e.g., 712345678)
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-5">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>You will receive an STK Push</strong> on your phone. Enter your M-Pesa PIN to complete the payment of <strong>KES {cartTotal.toFixed(2)}</strong>.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleMpesaPayment}
        disabled={isLoading || !isFormValid}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Initiating M-Pesa Payment...
          </div>
        ) : (
          `Pay KES ${cartTotal.toFixed(2)} with M-Pesa`
        )}
      </button>
    </div>
  );
};

export default CheckoutForm;