import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { addAddressAPI } from '../../api/userInfo';
import { saveAddress } from '../../store/features/user';
import {
  FaTimes, FaMapMarkerAlt, FaPhone, FaHome,
  FaLandmark, FaBuilding, FaRoad
} from 'react-icons/fa';

// 🔹 Could be moved to constants.js
const KENYAN_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
  'Machakos', 'Meru', 'Nyeri', 'Garissa', 'Wajir', 'Mandera',
  'Marsabit', 'Isiolo', 'Kitui', 'Embu', 'Kirinyaga', "Murang'a",
  'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia',
  'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia',
  'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga',
  'Bungoma', 'Busia', 'Siaya', 'Homa Bay', 'Migori', 'Kisii',
  'Nyamira', 'Lamu', 'Tana River', 'Taita-Taveta', 'Kwale', 'Kilifi'
];

// 🔹 Reusable Input
const FormInput = ({ label, icon: Icon, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {Icon && <Icon className="inline w-4 h-4 mr-1 text-blue-600" />}
      {label}
    </label>
    <input
      {...props}
      className={`w-full px-4 py-2 border rounded-lg transition-colors 
        ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        dark:bg-gray-700 dark:text-white`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// 🔹 Reusable Select
const FormSelect = ({ label, icon: Icon, error, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {Icon && <Icon className="inline w-4 h-4 mr-1 text-red-600" />}
      {label}
    </label>
    <select
      {...props}
      className={`w-full px-4 py-2 border rounded-lg transition-colors 
        ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        dark:bg-gray-700 dark:text-white`}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// 🔹 Reusable TextArea
const FormTextArea = ({ label, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <textarea
      {...props}
      className={`w-full px-4 py-2 border rounded-lg transition-colors resize-none
        ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        dark:bg-gray-700 dark:text-white`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const AddAddress = ({ onCancel }) => {
  const [values, setValues] = useState({
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
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  // 🔹 Validation
  const validate = () => {
    const errs = {};
    if (!values.name) errs.name = 'Address name is required';
    if (!values.county) errs.county = 'County is required';
    if (!values.estate) errs.estate = 'Estate/Area is required';
    if (!values.landmark && !values.building && !values.street) {
      errs.location = 'Provide landmark, building, or street';
    }
    if (!/^7\d{8}$/.test(values.phoneNumber)) {
  errs.phoneNumber = 'Phone must be 9 digits starting with 7 (e.g., 712345678)';
}
    return errs;
  };

  // 🔹 Submit Handler
  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    dispatch(setLoading(true));

    try {
      const res = await addAddressAPI(values);
      dispatch(saveAddress(res));
      onCancel && onCancel();
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Failed to add address' });
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  }, [values, dispatch, onCancel]);

  // 🔹 Input Handler
  const handleChange = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Add New Address
        </h2>
        <button
          onClick={onCancel}
          type="button"
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 
            dark:hover:text-gray-300 rounded-full hover:bg-gray-100 
            dark:hover:bg-gray-700 transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">

        <FormInput
          label="Address Name *"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="e.g., Home, Work, Parents' House"
          icon={FaHome}
          error={errors.name}
        />

        <FormSelect
          label="County *"
          name="county"
          value={values.county}
          onChange={handleChange}
          icon={FaMapMarkerAlt}
          error={errors.county}
        >
          <option value="">Select County</option>
          {KENYAN_COUNTIES.map(county => (
            <option key={county} value={county}>{county}</option>
          ))}
        </FormSelect>

        {/* Constituency / Ward */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Constituency"
            name="constituency"
            value={values.constituency}
            onChange={handleChange}
            placeholder="e.g., Westlands"
          />
          <FormInput
            label="Ward"
            name="ward"
            value={values.ward}
            onChange={handleChange}
            placeholder="e.g., Kangemi"
          />
        </div>

        <FormInput
          label="Estate/Area *"
          name="estate"
          value={values.estate}
          onChange={handleChange}
          placeholder="e.g., Kilimani"
          error={errors.estate}
        />

        {/* Location Identifiers */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Location Identifiers (provide at least one) *
          </p>
          <FormInput
            label="Landmark"
            name="landmark"
            value={values.landmark}
            onChange={handleChange}
            placeholder="Near Shell Petrol Station"
            icon={FaLandmark}
          />
          <FormInput
            label="Building"
            name="building"
            value={values.building}
            onChange={handleChange}
            placeholder="TRM Mall"
            icon={FaBuilding}
          />
          <FormInput
            label="Street/Road"
            name="street"
            value={values.street}
            onChange={handleChange}
            placeholder="Moi Avenue"
            icon={FaRoad}
          />
          {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
        </div>

        {/* Phone */}
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    <FaPhone className="inline w-4 h-4 mr-1 text-green-600" />
    Phone Number *
  </label>
  <div className="flex">
    <span className="px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-r-0 rounded-l-lg">
      +254
    </span>
    <input
      type="tel"
      name="phoneNumber"
      value={values.phoneNumber}
      onChange={handleChange}
      placeholder="712345678"
      maxLength={9}
      className={`flex-1 px-4 py-2 border rounded-r-lg transition-colors 
        ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
        dark:bg-gray-700 dark:text-white`}
      required
    />
  </div>
  {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
</div>

        <FormTextArea
          label="Additional Delivery Instructions"
          name="additionalInstructions"
          value={values.additionalInstructions}
          onChange={handleChange}
          rows={3}
        />

        {errors.global && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
            {errors.global}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            type="button"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 
              text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 
              dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 
              text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddress;
