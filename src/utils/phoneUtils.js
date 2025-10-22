// utils/phoneUtils.js

/**
 * Normalizes a phone number to the backend format (12 digits without +)
 * @param {string} phone - The phone number to normalize
 * @returns {string} - Normalized phone number (254XXXXXXXXX)
 * @throws {Error} - If phone number is invalid
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters including +
  const digits = phone.replace(/\D/g, '');
  
  // Handle different formats and convert to 12-digit format (254XXXXXXXXX)
  if (digits.startsWith('254') && digits.length === 12) {
    return digits; // Already in correct format
  } else if (digits.startsWith('0') && digits.length === 10) {
    return `254${digits.substring(1)}`; // Convert 07... to 2547...
  } else if (digits.startsWith('7') && digits.length === 9) {
    return `254${digits}`; // Convert 7... to 2547...
  } else if (digits.startsWith('1') && digits.length === 9) {
    return `254${digits}`; // Convert 1... to 2541...
  }
  
  throw new Error('Invalid phone number format');
};

/**
 * Formats a phone number for display (07XXXXXXXX)
 * @param {string} phone - The phone number to format
 * @returns {string} - Formatted phone number for display
 */
export const formatPhoneForDisplay = (phone) => {
  if (!phone) return '';
  
  const digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('2547') && digits.length === 12) {
    return `0${digits.substring(3)}`;
  } else if (digits.startsWith('2541') && digits.length === 12) {
    return `0${digits.substring(3)}`;
  } else if (digits.startsWith('0') && digits.length === 10) {
    return digits;
  } else if (digits.startsWith('7') && digits.length === 9) {
    return `0${digits}`;
  }
  
  return phone;
};

/**
 * Validates if a phone number is a valid Kenyan number
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateKenyanPhone = (phone) => {
  try {
    const normalized = normalizePhoneNumber(phone);
    // Validate it's exactly 12 digits and starts with 2547 or 2541
    return /^254(7\d{8}|1\d{8})$/.test(normalized);
  } catch {
    return false;
  }
};

/**
 * Extracts just the digits from a phone number
 * @param {string} phone - The phone number to process
 * @returns {string} - Only the digits of the phone number
 */
export const getPhoneDigits = (phone) => {
  return phone.replace(/\D/g, '');
};

/**
 * Formats phone number as user types (adds spacing for readability)
 * @param {string} phone - The phone number being typed
 * @returns {string} - Formatted phone number with spaces
 */
export const formatPhoneAsYouType = (phone) => {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  } else if (digits.length <= 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  } else {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9, 12)}`;
  }
};