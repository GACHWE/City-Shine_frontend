import React, { useCallback, useState } from 'react';
// Removed all Stripe-related imports:
// import {AddressElement, CardElement, PaymentElement, ShippingAddressElement, useElements, useStripe} from '@stripe/react-stripe-js';

import { placeOrderAPI } from '../../api/order';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../store/features/cart';
import { createOrderRequest } from '../../utils/order-util';
import { setLoading } from '../../store/features/common';

const CheckoutForm = ({ userId, addressId }) => {

  // Removed Stripe hooks:
  // const stripe = useStripe();
  // const elements = useElements();

  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Can keep if you'll use for M-Pesa success
  const [orderResponse, setOrderResponse] = useState(null); // Initialize with null or empty object

  const handleSubmit = useCallback(async (event) => {
    event?.preventDefault();

    const orderRequest = createOrderRequest(cartItems, userId, addressId);
    console.log("Order Request", orderRequest);

    dispatch(setLoading(true));
    setError('');
    setOrderResponse(null); // Reset order response

    // Removed Stripe payment submission and confirmation logic
    // const {error: stripeError} = await elements.submit();
    // if (stripeError?.message) {
    //   setError(stripeError?.message);
    //   dispatch(setLoading(false));
    //   return;
    // }

    // This part now directly calls placeOrderAPI without Stripe dependency
    // You'll integrate M-Pesa API call here later
    try {
      const res = await placeOrderAPI(orderRequest);
      setOrderResponse(res);
      setPaymentSuccess(true); // Assuming order placement implies success for now
      console.log("Order placed successfully:", res);
      // Here you would typically redirect to an order confirmation page
      // or show a success message.
      // e.g., navigate('/order-confirmation');

    } catch (err) {
      console.error("Error placing order:", err);
      setError('Failed to place order. Please try again.');
      setPaymentSuccess(false);
    } finally {
      dispatch(setLoading(false));
    }

  }, [addressId, cartItems, dispatch, userId]); // Removed elements and stripe from dependencies

  return (
    <form className='items-center p-2 mt-4 w-[320px] h-[320px]' onSubmit={handleSubmit}>
      {/* Removed Stripe PaymentElement */}
      {/* <PaymentElement /> */}

      {/* Placeholder for M-Pesa or other payment inputs */}
      <div className="payment-options-placeholder mt-4">
        {/* You will add M-Pesa input fields or a button here later */}
        <p>Your M-Pesa payment details or button will go here.</p>
      </div>

      <button
        type='submit'
        // disabled={!stripe} // Removed Stripe dependency for button disabled state
        className='w-[150px] items-center h-[48px] bg-black border rounded-lg mt-4 text-white hover:bg-gray-800'
      >
        Place Order
      </button>

      {error && <p className='text-sm pt-4 text-red-600'>{error}</p>}
      {paymentSuccess && orderResponse && (
        <p className='text-sm pt-4 text-green-600'>Order placed successfully! Order ID: {orderResponse.orderId}</p>
        // Adjust based on actual orderResponse structure
      )}
    </form>
  );
};

export default CheckoutForm;