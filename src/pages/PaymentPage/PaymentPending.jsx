import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkPaymentStatusAPI } from "../../api/order";

const PaymentPending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const pollingRef = useRef(null);
  const timeoutRef = useRef(null);

  const { orderId, checkoutRequestId, phoneNumber, amount } = location.state || {};

  const stopPolling = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const pollPaymentStatus = useCallback(async () => {
    if (!checkoutRequestId && !orderId) return;

    try {
      // Try using orderId first (UUID), fallback to checkoutRequestId
      const identifier = orderId || checkoutRequestId;
      const response = await checkPaymentStatusAPI(identifier);
      
      if (response.paymentStatus === "COMPLETED") {
        setStatus("success");
        stopPolling();
        
        setTimeout(() => {
          navigate("/order-confirmed", {
            state: { 
              orderId: response.orderId || orderId, 
              amount, 
              paymentMethod: "M-Pesa",
              mpesaReceiptNumber: response.mpesaReceiptNumber 
            },
            replace: true
          });
        }, 4000);
      } else if (response.paymentStatus === "FAILED") {
        setStatus("failed");
        setError("Payment failed. Please try again.");
        stopPolling();
      }
      // Continue polling for other statuses (PENDING, etc.)
    } catch (err) {
      console.error("Polling error:", err);
      // Don't stop polling on network errors, only stop on specific statuses
      if (err.response?.status === 404 || err.response?.status === 403) {
        setError("Payment not found or unauthorized");
        stopPolling();
      }
    }
  }, [checkoutRequestId, orderId, amount, navigate, stopPolling]);

  useEffect(() => {
    if (!orderId && !checkoutRequestId) {
      navigate("/checkout", { replace: true });
      return;
    }

    // Start polling every 5 seconds
    pollingRef.current = setInterval(pollPaymentStatus, 5000);

    // Set overall timeout (5 minutes)
    timeoutRef.current = setTimeout(() => {
      setStatus("timeout");
      setError("Payment verification timed out. Please check your M-Pesa messages.");
      stopPolling();
    }, 300000);

    // Update time remaining
    const interval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      stopPolling();
      clearInterval(interval);
    };
  }, [orderId, checkoutRequestId, navigate, pollPaymentStatus, stopPolling]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTryAgain = () => navigate("/checkout", { replace: true });
  const handleViewOrders = () => navigate("/account-details/orders", { replace: true });
  const handleContactSupport = () => window.open("/contact", "_blank");

  if (!orderId && !checkoutRequestId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-yellow-500 dark:text-yellow-400 mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Session Expired</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Please restart your checkout process.</p>
          <button onClick={handleTryAgain} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Return to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          {status === "pending" && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Time remaining: {formatTime(timeRemaining)}
              </div>
            </div>
          )}
          
          {status === "success" && <div className="text-green-500 text-6xl mb-4">✅</div>}
          {(status === "failed" || status === "timeout") && (
            <div className="text-red-500 text-6xl mb-4">❌</div>
          )}

          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {status === "pending" && "Waiting for Payment"}
            {status === "success" && "Payment Successful!"}
            {status === "failed" && "Payment Failed"}
            {status === "timeout" && "Payment Timeout"}
          </h1>
        </div>

        <div className="space-y-4 mb-6">
          {status === "pending" && (
            <>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Please check your phone <strong className="text-blue-600">{phoneNumber}</strong> 
                and enter your M-Pesa PIN to complete payment of <strong className="text-green-600">KES {amount?.toFixed(2)}</strong>.
              </p>
              <p className="text-sm text-gray-500 text-center">
                This page will automatically update when payment is confirmed.
              </p>
            </>
          )}
          {status === "success" && (
            <p className="text-green-600 text-center">Payment confirmed! Redirecting to order confirmation...</p>
          )}
          {(status === "failed" || status === "timeout") && (
            <p className="text-red-600 text-center">{error}</p>
          )}
        </div>

        {(status === "failed" || status === "timeout") && (
          <div className="space-y-3">
            <button onClick={handleTryAgain} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
              Try Again
            </button>
            <button onClick={handleViewOrders} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg">
              View Orders
            </button>
            <button onClick={handleContactSupport} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">
              Contact Support
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500">
            Order: #{orderId ? orderId.substring(0, 8).toUpperCase() : 'Pending'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;