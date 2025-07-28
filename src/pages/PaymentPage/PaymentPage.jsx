import React, { useEffect, useState } from 'react';
// import CheckoutForm from './CheckoutPayment'; // Keep this if CheckoutPayment contains other non-Stripe logic
// Make sure to adjust the import path for CheckoutPayment if it's not directly in the same folder.
// For now, let's assume it might still be needed for other non-Stripe parts of the checkout.
// If CheckoutPayment is PURELY Stripe related, you can remove its import and the component itself.
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { fetchUserDetails } from '../../api/userInfo';
import { selectCartItems } from '../../store/features/cart';

// Removed all Stripe-related imports:
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// Removed Stripe key and promise:
// const stripePublishableKey = import.meta.env.VITE_STRIPE_KEY || '';
// const stripePromise = loadStripe(stripePublishableKey);

const PaymentPage = (props) => {

    // Removed Stripe options:
    // const options = {
    //     mode: 'payment',
    //     amount: 100,
    //     currency: 'inr',
    //     appearance: {
    //         theme: 'flat'
    //     },
    // };

  return (
    <div>
        {/* Removed the <Elements> wrapper */}
        {/* <Elements stripe={stripePromise} options={options}> */}
             {/* If CheckoutPayment handles only Stripe, you might remove it entirely.
                 If it handles other checkout details, keep it and modify its content. */}
             {/* For now, assuming it has non-Stripe elements: */}
             <p>Payment options will be available here (e.g., M-Pesa integration).</p>
             {/* You'll replace this with your M-Pesa integration later */}
             {/* <CheckoutForm {...props}/> */}
        {/* </Elements> */}
    </div>
  )
}

export default PaymentPage;