import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCartItems, deleteCart } from "../../store/features/cart";
import { setLoading, showToast } from "../../store/features/common";
import { fetchUserDetails } from "../../api/userInfo";
import { placeOrderAPI, validateCodEligibility } from "../../api/order";
import {
  normalizePhoneNumber,
  validateKenyanPhone,
  formatPhoneAsYouType,
} from "../../utils/phoneUtils";
import AddressSection from "../../components/AddressSection";
import DeliveryDatePicker from "../../components/DeliveryDatePicker";
import TimeSlotPicker from "../../components/TimeSlotPicker";
import PaymentMethodSelector from "../../components/PaymentMethodSelector";
import OrderSummary from "../../components/OrderSummary";
import LoadingSpinner from "../../components/Spinner/Spinner";
import ErrorMessage from "../../components/UI/ErrorMessage";
import CODConfirmation from "../PaymentPage/CODConfirmation";

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [addressData, setAddressData] = useState({
    addressId: "",
    newAddress: null,
  });
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState("");
  const [codEligible, setCodEligible] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [showCODConfirmation, setShowCODConfirmation] = useState(false);

  const subTotal = useMemo(() => {
    return cartItems
      .reduce((total, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + itemPrice * quantity;
      }, 0)
      .toFixed(2);
  }, [cartItems]);

  const handleMpesaPhoneChange = (value) => {
    const formatted = formatPhoneAsYouType(value);
    setMpesaPhoneNumber(formatted);
  };

  useEffect(() => {
    const initializeUserData = async () => {
      setIsInitializing(true);
      dispatch(setLoading(true));

      try {
        const userData = await fetchUserDetails();
        setUserInfo(userData);

        if (userData?.addressList?.length > 0) {
          const defaultAddress =
            userData.addressList.find((addr) => addr.isDefault) ||
            userData.addressList[0];
          setAddressData((prev) => ({ ...prev, addressId: defaultAddress.id }));
          setSelectedCounty(defaultAddress.county);
          setCodEligible(validateCodEligibility(defaultAddress.county));
        }
      } catch (err) {
        dispatch(
          showToast({
            message: "Failed to load user information",
            type: "error",
          })
        );
      } finally {
        setIsInitializing(false);
        dispatch(setLoading(false));
      }
    };

    initializeUserData();
  }, [dispatch]);

  const handleAddressChange = useCallback(
    (newAddressData) => {
      setAddressData(newAddressData);

      let county = "";
      if (newAddressData.addressId) {
        const address = userInfo?.addressList?.find(
          (a) => a.id === newAddressData.addressId
        );
        county = address?.county || "";
      } else if (newAddressData.newAddress) {
        county = newAddressData.newAddress.county || "";
      }

      setSelectedCounty(county);
      const isEligible = validateCodEligibility(county);
      setCodEligible(isEligible);

      if (paymentMethod === "COD" && !isEligible) {
        setPaymentMethod("");
        dispatch(
          showToast({
            message:
              "COD not available for this location. Please select another payment method.",
            type: "warning",
          })
        );
      }
    },
    [userInfo, paymentMethod, dispatch]
  );

  const validateForm = useCallback(() => {
    if (!addressData.addressId && !addressData.newAddress) {
      return "Please select or add a delivery address.";
    }
    if (addressData.newAddress) {
      const { county, estate, phoneNumber } = addressData.newAddress;
      if (!county || !estate) {
        return "County and estate are required fields.";
      }
      if (!validateKenyanPhone(phoneNumber)) {
        return "Please provide a valid Kenyan phone number for delivery.";
      }
    }

    if (!selectedDate || !selectedTime) {
      return "Please select a delivery date and time.";
    }

    if (!paymentMethod) {
      return "Please select a payment method.";
    }
    if (paymentMethod === "MPESA") {
      if (!mpesaPhoneNumber) return "Phone number is required for M-Pesa.";
      if (!validateKenyanPhone(mpesaPhoneNumber)) {
        return "Please provide a valid Kenyan phone number.";
      }
    }
    if (paymentMethod === "COD" && !codEligible) {
      return "Cash on Delivery is only available for Nairobi county.";
    }
    return null;
  }, [addressData, selectedDate, selectedTime, paymentMethod, mpesaPhoneNumber, codEligible]);

  const handlePlaceOrder = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      dispatch(showToast({ message: validationError, type: "error" }));
      return;
    }

    if (paymentMethod === "COD") {
      setShowCODConfirmation(true);
      return;
    }

    await submitOrder();
  };

  const submitOrder = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Prepare order items according to backend structure
      const orderItems = cartItems.map((item) => ({
        productId: item.productId,
        productVariantId: item.variantId || null,
        quantity: parseInt(item.quantity),
        itemPrice: parseFloat(item.price) || 0,
      }));

      // Calculate total amount
      const totalAmount = cartItems.reduce((total, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + itemPrice * quantity;
      }, 0);

      // Prepare order data according to backend expectations
      const orderData = {
        orderItems: orderItems,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        expectedDeliveryDate: new Date(
          `${selectedDate}T${selectedTime.split(" - ")[0]}:00`
        ).toISOString(),
      };

      // Add address information
      if (addressData.addressId) {
        orderData.addressId = addressData.addressId;
      } else if (addressData.newAddress) {
        orderData.deliveryAddress = {
          name: addressData.newAddress.name || "Home",
          estate: addressData.newAddress.estate,
          county: addressData.newAddress.county,
          phoneNumber: normalizePhoneNumber(addressData.newAddress.phoneNumber),
          additionalInfo: addressData.newAddress.additionalInfo || "",
          isDefault: false
        };
      }

      // Add phone number for MPESA payments
      if (paymentMethod === "MPESA") {
        orderData.phoneNumber = normalizePhoneNumber(mpesaPhoneNumber);
      }

      console.log("Submitting order data:", orderData);

      const response = await placeOrderAPI(orderData);
      
      // Clear cart after successful order
      dispatch(deleteCart());

      // Navigate based on payment method
      if (paymentMethod === "COD") {
        navigate("/order-confirmed", {
          state: {
            orderId: response.id || response.orderId,
            paymentMethod: "COD",
            amount: totalAmount,
            deliveryDate: selectedDate,
            deliveryTime: selectedTime,
            items: cartItems.length,
          },
        });
      } else {
        navigate("/payment-pending", {
          state: {
            orderId: response.id || response.orderId,
            checkoutRequestId: response.checkoutRequestId,
            message: response.message || "Payment initiated successfully",
            paymentMethod: "MPESA",
          },
        });
      }

      dispatch(showToast({ 
        message: "Order placed successfully!", 
        type: "success" 
      }));
    } catch (err) {
      console.error("Order placement error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to place order. Please try again.";
      setError(errorMessage);
      dispatch(showToast({ 
        message: errorMessage, 
        type: "error" 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCODConfirmation = async (confirmed) => {
    if (confirmed) {
      await submitOrder();
    }
    setShowCODConfirmation(false);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" message="Loading checkout..." />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column - Full Form */}
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <AddressSection
              userInfo={userInfo}
              addressData={addressData}
              onAddressChange={handleAddressChange}
              selectedCounty={selectedCounty}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Schedule</h2>
            <DeliveryDatePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setSelectedTime={setSelectedTime}
            />
            {selectedDate && (
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
              />
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              mpesaPhoneNumber={mpesaPhoneNumber}
              setMpesaPhoneNumber={handleMpesaPhoneChange}
              subTotal={subTotal}
              codEligible={codEligible}
              selectedCounty={selectedCounty}
            />
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
          >
            {isLoading ? "Processing..." : "Place Order"}
          </button>

          {error && <ErrorMessage message={error} />}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-96">
          <div className="sticky top-6">
            <OrderSummary
              cartItems={cartItems}
              subTotal={subTotal}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              addressData={addressData}
              userInfo={userInfo}
            />
          </div>
        </div>

        {/* COD Confirmation Modal */}
        {showCODConfirmation && (
          <CODConfirmation
            orderData={{
              address: addressData,
              deliveryDate: selectedDate,
              deliveryTime: selectedTime,
              totalAmount: subTotal,
              itemsCount: cartItems.length,
            }}
            onConfirm={() => handleCODConfirmation(true)}
            onCancel={() => handleCODConfirmation(false)}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(Checkout);

