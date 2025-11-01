import React from 'react';
import {
  FaHome,
  FaMapMarkerAlt,
  FaLandmark,
  FaBuilding,
  FaRoad,
  FaPhone,
} from "react-icons/fa";
import {
  validateKenyanPhone,
  formatPhoneAsYouType,
  normalizePhoneNumber
} from "../utils/phoneUtils";

const KENYAN_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika",
  "Machakos", "Meru", "Nyeri", "Garissa", "Wajir", "Mandera",
  "Marsabit", "Isiolo", "Kitui", "Embu", "Kirinyaga", "Murang'a",
  "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia",
  "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia",
  "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga",
  "Bungoma", "Busia", "Siaya", "Homa Bay", "Migori", "Kisii",
  "Nyamira", "Lamu", "Tana River", "Taita-Taveta", "Kwale", "Kilifi"
];

// Reusable Input Component
const FormInput = ({ label, icon: Icon, error, required, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {Icon && <Icon className="inline w-4 h-4 mr-1 text-blue-600" />}
      {label} {required && '*'}
    </label>
    <input
      {...props}
      className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
        error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// Reusable Select Component
const FormSelect = ({ label, icon: Icon, error, required, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {Icon && <Icon className="inline w-4 h-4 mr-1 text-red-600" />}
      {label} {required && '*'}
    </label>
    <select
      {...props}
      className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
        error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
      }`}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// Phone Input Component with proper validation
const PhoneInput = ({ value, onChange, error, required }) => {
  const handlePhoneChange = (e) => {
    const input = e.target.value;
    
    // Allow only numbers, +, and spaces
    if (/^[+\d\s]*$/.test(input)) {
      // Format as user types for better UX
      const formatted = formatPhoneAsYouType(input.replace(/\s/g, ''));
      onChange(formatted);
    }
  };

  const handleBlur = () => {
    // When field loses focus, try to normalize and validate
    if (value && !validateKenyanPhone(value)) {
      // Keep the value but show validation error
      // The parent component will handle the validation state
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        <FaPhone className="inline w-4 h-4 mr-1 text-green-600" />
        Phone Number {required && '*'}
      </label>
      <input
        type="tel"
        placeholder="07XX XXX XXX or +254 7XX XXX XXX"
        value={value}
        onChange={handlePhoneChange}
        onBlur={handleBlur}
        className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        }`}
        required={required}
        maxLength={15} // Allow for spaces in formatted number
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Format: 07XX XXX XXX or +254 7XX XXX XXX
      </p>
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
          {error}
        </p>
      )}
      {value && !validateKenyanPhone(value) && !error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
          Please enter a valid Kenyan phone number
        </p>
      )}
    </div>
  );
};

// Main Address Form Component
const AddressForm = ({
  values,
  errors = {},
  onChange,
  showHeader = false,
  onCancel,
  onSubmit,
  submitting = false,
  submitLabel = "Save Address",
  showPhoneValidation = true,
  phoneFieldRequired = true
}) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  // Helper to normalize phone before submission
  const getNormalizedPhone = () => {
    try {
      return normalizePhoneNumber(values.phoneNumber);
    } catch {
      return values.phoneNumber;
    }
  };

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Address
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Address Name"
          icon={FaHome}
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Home, Work, etc."
          error={errors.name}
          required
        />

        <FormSelect
          label="County"
          icon={FaMapMarkerAlt}
          value={values.county}
          onChange={(e) => handleChange('county', e.target.value)}
          error={errors.county}
          required
        >
          <option value="">Select County</option>
          {KENYAN_COUNTIES.map((county) => (
            <option key={county} value={county}>{county}</option>
          ))}
        </FormSelect>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Constituency"
          value={values.constituency}
          onChange={(e) => handleChange('constituency', e.target.value)}
          placeholder="e.g., Westlands"
        />
        
        <FormInput
          label="Ward"
          value={values.ward}
          onChange={(e) => handleChange('ward', e.target.value)}
          placeholder="e.g., Kangemi"
        />
      </div>

      <FormInput
        label="Estate/Area"
        value={values.estate}
        onChange={(e) => handleChange('estate', e.target.value)}
        placeholder="e.g., Westlands, Kilimani"
        error={errors.estate}
        required
      />

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Location Identifier (choose at least one) *
        </label>

        <FormInput
          label="Landmark"
          icon={FaLandmark}
          value={values.landmark}
          onChange={(e) => handleChange('landmark', e.target.value)}
          placeholder="e.g., Near Shell Petrol Station"
        />

        <FormInput
          label="Building"
          icon={FaBuilding}
          value={values.building}
          onChange={(e) => handleChange('building', e.target.value)}
          placeholder="e.g., Ushirika House, TRM Mall"
        />

        <FormInput
          label="Street"
          icon={FaRoad}
          value={values.street}
          onChange={(e) => handleChange('street', e.target.value)}
          placeholder="e.g., Waiyaki Way, Moi Avenue"
        />
        
        {errors.location && (
          <p className="text-red-600 dark:text-red-400 text-sm">
            {errors.location}
          </p>
        )}
      </div>

      <PhoneInput
        value={values.phoneNumber}
        onChange={(value) => handleChange('phoneNumber', value)}
        error={errors.phoneNumber}
        required={phoneFieldRequired}
      />

      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
          Additional Instructions
        </label>
        <textarea
          placeholder="e.g., Call when arriving, Leave at gate"
          value={values.additionalInstructions}
          onChange={(e) => handleChange('additionalInstructions', e.target.value)}
          rows={2}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
        />
      </div>

      {onSubmit && onCancel && (
        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            type="button"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
          >
            {submitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressForm;