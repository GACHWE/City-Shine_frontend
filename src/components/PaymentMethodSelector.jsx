import React, { useState } from "react";
import { FaCreditCard, FaMapMarkerAlt, FaPhone, FaInfoCircle } from "react-icons/fa";
import { validateKenyanPhone, formatKenyanPhoneNumber, formatCurrency } from "../utils/format";
import { initiateStkPushAPI, checkPaymentStatusAPI } from "../api/order";

const PaymentMethodSelector = ({
  paymentMethod,
  setPaymentMethod,
  mpesaPhoneNumber,
  setMpesaPhoneNumber,
  subTotal,
  codEligible,
  selectedCounty,
  onPaymentInitiated,
  orderId,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^[+\d\s]*$/.test(value)) {
      setMpesaPhoneNumber(value);
      setError(null);
    }
  };

  const handleInitiatePayment = async () => {
    if (paymentMethod === "MPESA" && !validateKenyanPhone(mpesaPhoneNumber)) {
      setError("Please enter a valid Kenyan phone number (07XXXXXXXX or +2547XXXXXXXX)");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (paymentMethod === "MPESA") {
        const formattedPhone = formatKenyanPhoneNumber(mpesaPhoneNumber);
        const response = await initiateStkPushAPI(orderId, formattedPhone, subTotal);
        if (response.status === "PENDING") {
          onPaymentInitiated(response.checkoutRequestId);
        } else {
          setError(response.message || "Failed to initiate M-Pesa payment");
        }
      } else if (paymentMethod === "COD") {
        onPaymentInitiated(null); // COD doesn't need a checkoutRequestId
      }
    } catch (err) {
      setError(err.message || "Failed to initiate payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
        Payment Method
      </h2>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
          <input
            type="radio"
            value="MPESA"
            checked={paymentMethod === "MPESA"}
            onChange={() => setPaymentMethod("MPESA")}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="flex-1">M-Pesa</span>
          <span className="text-green-600 text-sm">Instant</span>
        </label>

        <label
          className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
            codEligible
              ? "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              : "border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"
          }`}
        >
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => codEligible && setPaymentMethod("COD")}
            disabled={!codEligible}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="flex-1">Cash on Delivery</span>
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            Pay when delivered
          </span>
        </label>
      </div>

      {!codEligible && selectedCounty && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700 mt-4">
          <div className="flex items-start">
            <FaMapMarkerAlt className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                COD not available for {selectedCounty}
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Cash on Delivery is only available for orders within Nairobi County.
              </p>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "MPESA" && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
            <FaPhone className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            M-Pesa Payment Details
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Enter your M-Pesa phone number
              </label>
              <input
                type="tel"
                value={mpesaPhoneNumber}
                onChange={handlePhoneChange}
                placeholder="07XXXXXXXX or +2547XXXXXXXX"
                className="w-full p-2 border border-blue-200 dark:border-blue-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={13}
                disabled={isProcessing}
              />
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Format: 07XXXXXXXX or +2547XXXXXXXX
              </p>
            </div>

            <div className="bg-white dark:bg-blue-900/30 p-3 rounded border border-blue-100 dark:border-blue-700">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>How it works:</strong> You will receive an STK Push on
                this number. Enter your M-Pesa PIN to complete payment of{" "}
                <strong>{formatCurrency(subTotal)}</strong>.
              </p>
            </div>

            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </p>
            )}
          </div>
        </div>
      )}

      {paymentMethod === "COD" && codEligible && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
            <FaInfoCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
            Cash on Delivery Details
          </h3>

          <div className="space-y-2">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>Payment amount:</strong> {formatCurrency(subTotal)}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>Payment method:</strong> Cash upon delivery
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Please have the exact amount ready for the delivery person.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleInitiatePayment}
        disabled={isProcessing || (paymentMethod === "MPESA" && !validateKenyanPhone(mpesaPhoneNumber))}
        className={`mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
          isProcessing || (paymentMethod === "MPESA" && !validateKenyanPhone(mpesaPhoneNumber))
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isProcessing ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
};

export default PaymentMethodSelector;