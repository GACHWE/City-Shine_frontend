// components/AddressSection.jsx
import React from "react";
import {
  FaHome,
  FaMapMarkerAlt,
  FaLandmark,
  FaBuilding,
  FaRoad,
  FaPhone,
  FaInfoCircle,
} from "react-icons/fa";
import { validateKenyanPhone } from "../utils/phoneUtils";

const AddressSection = ({
  userInfo,
  addressData,
  onAddressChange
}) => {
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

  const kenyanCounties = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika",
    "Machakos", "Meru", "Nyeri", "Garissa", "Wajir", "Mandera",
    "Marsabit", "Isiolo", "Kitui", "Embu", "Kirinyaga", "Murang'a",
    "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia",
    "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia",
    "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga",
    "Bungoma", "Busia", "Siaya", "Homa Bay", "Migori", "Kisii",
    "Nyamira", "Lamu", "Tana River", "Taita-Taveta", "Kwale", "Kilifi"
  ];

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
    onAddressChange({
      addressId,
      newAddress: null
    });
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

          {/* New Address Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaHome className="inline w-4 h-4 mr-1 text-blue-600" />
                Address Name *
              </label>
              <input
                type="text"
                placeholder="Home, Work, etc."
                value={newAddress.name}
                onChange={(e) => handleNewAddressChange("name", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaMapMarkerAlt className="inline w-4 h-4 mr-1 text-red-600" />
                County *
              </label>
              <select
                value={newAddress.county}
                onChange={(e) => handleNewAddressChange("county", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select County</option>
                {kenyanCounties.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Constituency
              </label>
              <input
                type="text"
                placeholder="e.g., Westlands"
                value={newAddress.constituency}
                onChange={(e) => handleNewAddressChange("constituency", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Ward
              </label>
              <input
                type="text"
                placeholder="e.g., Kangemi"
                value={newAddress.ward}
                onChange={(e) => handleNewAddressChange("ward", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estate/Area *
            </label>
            <input
              type="text"
              placeholder="e.g., Westlands, Kilimani"
              value={newAddress.estate}
              onChange={(e) => handleNewAddressChange("estate", e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location Identifier (choose at least one) *
            </label>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                <FaLandmark className="inline w-4 h-4 mr-1 text-blue-600" />
                Landmark
              </label>
              <input
                type="text"
                placeholder="e.g., Near Shell Petrol Station"
                value={newAddress.landmark}
                onChange={(e) => handleNewAddressChange("landmark", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                <FaBuilding className="inline w-4 h-4 mr-1 text-green-600" />
                Building
              </label>
              <input
                type="text"
                placeholder="e.g., Ushirika House, TRM Mall"
                value={newAddress.building}
                onChange={(e) => handleNewAddressChange("building", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                <FaRoad className="inline w-4 h-4 mr-1 text-purple-600" />
                Street
              </label>
              <input
                type="text"
                placeholder="e.g., Waiyaki Way, Moi Avenue"
                value={newAddress.street}
                onChange={(e) => handleNewAddressChange("street", e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaPhone className="inline w-4 h-4 mr-1 text-green-600" />
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="07XXXXXXXX or +2547XXXXXXXX"
              value={newAddress.phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[+\d]*$/.test(value)) {
                  handleNewAddressChange("phoneNumber", value);
                }
              }}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
              maxLength={13}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Format: 07XXXXXXXX or +2547XXXXXXXX
            </p>
            {!validateKenyanPhone(newAddress.phoneNumber) && newAddress.phoneNumber && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                Please enter a valid Kenyan phone number
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Additional Instructions
            </label>
            <textarea
              placeholder="e.g., Call when arriving, Leave at gate"
              value={newAddress.additionalInstructions}
              onChange={(e) => handleNewAddressChange("additionalInstructions", e.target.value)}
              rows={2}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>

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