import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom';

const OrderConfirmed = () => {

  const location = useLocation();

  const { orderId, paymentMethod } = useMemo(()=>{ // Destructure both orderId and paymentMethod
    const query = new URLSearchParams(location.search);
    const orderId = query.get('orderId');
    const method = query.get('method'); // Get the 'method' parameter
    return { orderId, paymentMethod: method }; // Return both
  },[location.search]);

  return (
    <div className='p-8'>
        <h1 className='text-2xl'>Thank you for shopping with us!</h1>
        <p>Your order has been successfully placed. Your order ID is <strong>{orderId}</strong>.</p>
        {paymentMethod && <p>Payment Method: <strong>{paymentMethod}</strong>.</p>} {/* Display payment method if available */}
    </div>
  )
}

export default OrderConfirmed