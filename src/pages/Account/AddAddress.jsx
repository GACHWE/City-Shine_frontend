// import React, { useCallback, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setLoading } from '../../store/features/common';
// import { addAddressAPI } from '../../api/userInfo';
// import { saveAddress } from '../../store/features/user';
// import { FaTimes } from 'react-icons/fa';
// import { normalizePhoneNumber, validateKenyanPhone } from '../../utils/phoneUtils';
// import AddressForm from '../../components/AddressForm';

// const AddAddress = ({ onCancel }) => {
//   const [values, setValues] = useState({
//     name: '',
//     county: '',
//     constituency: '',
//     ward: '',
//     estate: '',
//     landmark: '',
//     building: '',
//     street: '',
//     phoneNumber: '',
//     additionalInstructions: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const dispatch = useDispatch();

//   const validate = () => {
//     const errs = {};
//     if (!values.name) errs.name = 'Address name is required';
//     if (!values.county) errs.county = 'County is required';
//     if (!values.estate) errs.estate = 'Estate/Area is required';
//     if (!values.landmark && !values.building && !values.street) {
//       errs.location = 'Provide at least one location identifier (landmark, building, or street)';
//     }
//     if (!values.phoneNumber) {
//       errs.phoneNumber = 'Phone number is required';
//     } else if (!validateKenyanPhone(values.phoneNumber)) {
//       errs.phoneNumber = 'Please enter a valid Kenyan phone number';
//     }
//     return errs;
//   };

//   const onSubmit = useCallback(async (e) => {
//     e.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       return;
//     }
//     setErrors({});
//     setSubmitting(true);
//     dispatch(setLoading(true));

//     try {
//       // Normalize phone number before sending to backend
//       const submissionData = {
//         ...values,
//         phoneNumber: normalizePhoneNumber(values.phoneNumber)
//       };

//       const res = await addAddressAPI(submissionData);
//       dispatch(saveAddress(res));
//       onCancel && onCancel();
//     } catch (err) {
//       setErrors({ global: err.response?.data?.message || 'Failed to add address' });
//     } finally {
//       setSubmitting(false);
//       dispatch(setLoading(false));
//     }
//   }, [values, dispatch, onCancel]);

//   const handleChange = (field, value) => {
//     setValues(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: undefined }));
//     }
//   };

//   return (
//     <div className="max-w-2xl">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//           Add New Address
//         </h2>
//         <button
//           onClick={onCancel}
//           type="button"
//           className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//         >
//           <FaTimes className="w-5 h-5" />
//         </button>
//       </div>

//       <form onSubmit={onSubmit}>
//         <AddressForm
//           values={values}
//           errors={errors}
//           onChange={handleChange}
//           showHeader={false}
//           onCancel={onCancel}
//           onSubmit={onSubmit}
//           submitting={submitting}
//           submitLabel="Save Address"
//           phoneFieldRequired={true}
//         />
        
//         {errors.global && (
//           <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg mt-4">
//             {errors.global}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default AddAddress;
import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { addAddressAPI, updateAddressAPI } from '../../api/userInfo';
import { saveAddress, updateAddress } from '../../store/features/user';
import { FaTimes } from 'react-icons/fa';
import { normalizePhoneNumber, validateKenyanPhone } from '../../utils/phoneUtils';
import AddressForm from '../../components/AddressForm';

const AddressModal = ({ 
  onCancel, 
  mode = 'add', // 'add' or 'edit'
  initialData = null, // Existing address data for edit mode
  onSuccess = null // Optional success callback
}) => {
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

  // Initialize form with existing data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setValues({
        name: initialData.name || '',
        county: initialData.county || '',
        constituency: initialData.constituency || '',
        ward: initialData.ward || '',
        estate: initialData.estate || '',
        landmark: initialData.landmark || '',
        building: initialData.building || '',
        street: initialData.street || '',
        phoneNumber: initialData.phoneNumber || '',
        additionalInstructions: initialData.additionalInstructions || ''
      });
    }
  }, [mode, initialData]);

  const validate = () => {
    const errs = {};
    if (!values.name) errs.name = 'Address name is required';
    if (!values.county) errs.county = 'County is required';
    if (!values.estate) errs.estate = 'Estate/Area is required';
    if (!values.landmark && !values.building && !values.street) {
      errs.location = 'Provide at least one location identifier (landmark, building, or street)';
    }
    if (!values.phoneNumber) {
      errs.phoneNumber = 'Phone number is required';
    } else if (!validateKenyanPhone(values.phoneNumber)) {
      errs.phoneNumber = 'Please enter a valid Kenyan phone number';
    }
    return errs;
  };

  const handleSubmit = useCallback(async (e) => {
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
      // Normalize phone number before sending to backend
      const submissionData = {
        ...values,
        phoneNumber: normalizePhoneNumber(values.phoneNumber)
      };

      let response;
      if (mode === 'edit' && initialData?.id) {
        // Include the address ID for updates
        response = await addAddressAPI(submissionData);
        dispatch(saveAddress(response));
      } else {
        response = await addAddressAPI(submissionData);
        dispatch(saveAddress(response));
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response);
      }
      
      onCancel && onCancel();
    } catch (err) {
      setErrors({ global: err.response?.data?.message || `Failed to ${mode} address` });
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  }, [values, dispatch, onCancel, mode, initialData, onSuccess]);

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getTitle = () => {
    return mode === 'edit' ? 'Edit Address' : 'Add New Address';
  };

  const getSubmitLabel = () => {
    return submitting 
      ? (mode === 'edit' ? 'Updating...' : 'Saving...') 
      : (mode === 'edit' ? 'Update Address' : 'Save Address');
  };

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {getTitle()}
        </h2>
        <button
          onClick={onCancel}
          type="button"
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          disabled={submitting}
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <AddressForm
          values={values}
          errors={errors}
          onChange={handleChange}
          showHeader={false}
          onCancel={onCancel}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel={getSubmitLabel()}
          phoneFieldRequired={true}
          cancelDisabled={submitting}
        />
        
        {errors.global && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg mt-4">
            {errors.global}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddressModal;