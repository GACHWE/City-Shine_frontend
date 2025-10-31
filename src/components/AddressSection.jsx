import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { validateKenyanPhone } from "../utils/phoneUtils";
import AddressForm from "./AddressForm";

const AddressSection = ({ userInfo, addressData, onAddressChange }) => {
  const [showNewAddressForm, setShowNewAddressForm] = React.useState(!addressData.addressId);
  const [newAddress, setNewAddress] = React.useState({
    name: '',
    county: '',
    constituency: '',
    ward: '',
    estate: '',
    landmark: '',
    building: '',
    street: '',
    phoneNumber: '',
    additionalInstructions: ''
  });

  const handleNewAddressChange = (field, value) => {
    const updatedAddress = { ...newAddress, [field]: value };
    setNewAddress(updatedAddress);
    
    if (showNewAddressForm) {
      onAddressChange({
        addressId: null,
        newAddress: updatedAddress
      });
    }
  };

  const handleAddressSelect = (addressId) => {
    setShowNewAddressForm(false);
    onAddressChange({ addressId, newAddress: null });
  };

  const formatAddressDisplay = (address) => {
    if (!address) return "";
    return `${address.estate}, ${address.county}` +
      (address.street ? `, ${address.street}` : "") +
      (address.building ? `, ${address.building}` : "") +
      (address.landmark ? ` (Near ${address.landmark})` : "");
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
        Delivery Address
      </h2>

      {userInfo.addressList?.length > 0 && !showNewAddressForm ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Delivery Address
            </label>
            <select
              value={addressData.addressId || ''}
              onChange={(e) => handleAddressSelect(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {userInfo.addressList.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.name} - {formatAddressDisplay(address)}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
            <div className="flex items-start">
              <FaInfoCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Using your saved address. You can{" "}
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  add a new address
                </button>{" "}
                if needed.
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <div className="flex items-start">
              <FaInfoCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {userInfo.addressList?.length > 0
                  ? "Adding a new delivery address"
                  : "Please add your delivery address"}
              </p>
            </div>
          </div>

          <AddressForm
            values={newAddress}
            onChange={handleNewAddressChange}
            phoneValidation={validateKenyanPhone}
          />

          {userInfo.addressList?.length > 0 && (
            <button
              onClick={() => setShowNewAddressForm(false)}
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline font-medium"
            >
              ← Use saved address instead
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSection;