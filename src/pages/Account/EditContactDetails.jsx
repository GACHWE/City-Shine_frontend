// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { setLoading } from '../../store/features/common';
// import { updateUserProfile } from '../../store/features/user';
// import { updateProfileAPI } from '../../api/userInfo';
// import { FaTimes, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
// import { validateKenyanPhone, normalizePhoneNumber } from '../../utils/phoneUtils';

// const EditContactDetails = ({ onCancel, initialData, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     email: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const dispatch = useDispatch();

//   // Initialize form with initial data
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         firstName: initialData.firstName || '',
//         lastName: initialData.lastName || '',
//         phoneNumber: initialData.phoneNumber || '',
//         email: initialData.email || ''
//       });
//     }
//   }, [initialData]);

//   const validateForm = () => {
//     const newErrors = {};

//     // First Name validation
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = 'First name is required';
//     } else if (formData.firstName.trim().length < 2) {
//       newErrors.firstName = 'First name must be at least 2 characters';
//     }

//     // Last Name validation
//     if (!formData.lastName.trim()) {
//       newErrors.lastName = 'Last name is required';
//     } else if (formData.lastName.trim().length < 2) {
//       newErrors.lastName = 'Last name must be at least 2 characters';
//     }

//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     // Phone number validation (optional but if provided, validate)
//     if (formData.phoneNumber.trim() && !validateKenyanPhone(formData.phoneNumber)) {
//       newErrors.phoneNumber = 'Please enter a valid Kenyan phone number';
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     setErrors({});
//     setSubmitting(true);
//     dispatch(setLoading(true));

//     try {
//       // Prepare submission data
//       const submissionData = {
//         firstName: formData.firstName.trim(),
//         lastName: formData.lastName.trim(),
//         email: formData.email.trim(),
//         ...(formData.phoneNumber.trim() && { 
//           phoneNumber: normalizePhoneNumber(formData.phoneNumber) 
//         })
//       };

//       const response = await updateProfileAPI(submissionData);
//       dispatch(updateUserProfile(response));
      
//       // Call success callback
//       if (onSuccess) {
//         onSuccess(response);
//       }
//     } catch (error) {
//       console.error('Failed to update profile:', error);
//       setErrors({ 
//         global: error.response?.data?.message || error.message || 'Failed to update profile' 
//       });
//     } finally {
//       setSubmitting(false);
//       dispatch(setLoading(false));
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
    
//     // Clear field error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: undefined }));
//     }
//   };

//   const handlePhoneChange = (value) => {
//     // Auto-format phone number as user types
//     let formattedValue = value;
    
//     // Remove all non-digit characters except +
//     formattedValue = formattedValue.replace(/[^\d+]/g, '');
    
//     // Auto-add Kenyan country code if starting with 0 or 7
//     if (formattedValue.startsWith('0')) {
//       formattedValue = '+254' + formattedValue.slice(1);
//     } else if (formattedValue.startsWith('7') && !formattedValue.startsWith('+')) {
//       formattedValue = '+254' + formattedValue;
//     }
    
//     handleChange('phoneNumber', formattedValue);
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//           Edit Contact Details
//         </h2>
//         <button
//           onClick={onCancel}
//           type="button"
//           className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//           disabled={submitting}
//         >
//           <FaTimes className="w-5 h-5" />
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Name Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               <FaUser className="w-4 h-4 inline mr-2 text-gray-400" />
//               First Name *
//             </label>
//             <input
//               type="text"
//               value={formData.firstName}
//               onChange={(e) => handleChange('firstName', e.target.value)}
//               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                 errors.firstName 
//                   ? 'border-red-300 dark:border-red-500' 
//                   : 'border-gray-300 dark:border-gray-600'
//               }`}
//               placeholder="Enter your first name"
//               disabled={submitting}
//             />
//             {errors.firstName && (
//               <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               <FaUser className="w-4 h-4 inline mr-2 text-gray-400" />
//               Last Name *
//             </label>
//             <input
//               type="text"
//               value={formData.lastName}
//               onChange={(e) => handleChange('lastName', e.target.value)}
//               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                 errors.lastName 
//                   ? 'border-red-300 dark:border-red-500' 
//                   : 'border-gray-300 dark:border-gray-600'
//               }`}
//               placeholder="Enter your last name"
//               disabled={submitting}
//             />
//             {errors.lastName && (
//               <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
//             )}
//           </div>
//         </div>

//         {/* Email Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             <FaEnvelope className="w-4 h-4 inline mr-2 text-gray-400" />
//             Email Address *
//           </label>
//           <input
//             type="email"
//             value={formData.email}
//             onChange={(e) => handleChange('email', e.target.value)}
//             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//               errors.email 
//                 ? 'border-red-300 dark:border-red-500' 
//                 : 'border-gray-300 dark:border-gray-600'
//             }`}
//             placeholder="your.email@example.com"
//             disabled={submitting}
//           />
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
//           )}
//         </div>

//         {/* Phone Number Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             <FaPhone className="w-4 h-4 inline mr-2 text-gray-400" />
//             Phone Number
//           </label>
//           <input
//             type="tel"
//             value={formData.phoneNumber}
//             onChange={(e) => handlePhoneChange(e.target.value)}
//             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//               errors.phoneNumber 
//                 ? 'border-red-300 dark:border-red-500' 
//                 : 'border-gray-300 dark:border-gray-600'
//             }`}
//             placeholder="+254 712 345 678"
//             disabled={submitting}
//           />
//           {errors.phoneNumber ? (
//             <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber}</p>
//           ) : (
//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               Enter your Kenyan phone number (optional)
//             </p>
//           )}
//         </div>

//         {/* Global Error */}
//         {errors.global && (
//           <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
//             {errors.global}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-3 pt-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
//             disabled={submitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {submitting ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Updating...
//               </span>
//             ) : (
//               'Update Details'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditContactDetails;

import React from 'react'

const EditContactDetails = () => {
  return (
    <div>EditContactDetails</div>
  )
}

export default EditContactDetails