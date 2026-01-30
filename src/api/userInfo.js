import axios from "axios";
import { API_BASE_URL, getHeaders } from "./constant";

export const fetchUserDetails = async () => {
  const url = API_BASE_URL + "/api/user/profile";
  try {
    const response = await axios.get(url, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch user details"
    );
  }
};

export const addAddressAPI = async (data) => {
  const url = API_BASE_URL + "/api/address";
  try {
    // Convert to Kenyan address format
    const kenyanAddress = convertToKenyanAddressFormat(data);

    const response = await axios.post(url, kenyanAddress, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Failed to add address";
    throw new Error(errorMessage);
  }
};

export const updateAddressAPI = async (data) => {
  if (!data.id) {
    throw new Error("Address ID is required for update");
  }
  
  const url = API_BASE_URL + "/api/address/";
  try {
    const kenyanAddress = convertToKenyanAddressFormat(data);
    const response = await axios.post(url, kenyanAddress, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Failed to update address";
    throw new Error(errorMessage);
  }
};

export const changePasswordAPI = async (oldPassword, newPassword) => {
  const url = API_BASE_URL + "/api/user/change-password";
  try {
    const response = await axios.post(
      url,
      { oldPassword, newPassword },
      {
        headers: getHeaders(),
      }
    );
    return response?.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Failed to change password";
    throw new Error(errorMessage);
  }
};

// Helper function to convert address to Kenyan format
const convertToKenyanAddressFormat = (data) => {
  // If already in Kenyan format, return as-is
  if (data.county) {
    return {
      name: data.name,
      county: data.county,
      constituency: data.constituency || "",
      ward: data.ward || "",
      estate: data.estate,
      landmark: data.landmark || "",
      building: data.building || "",
      street: data.street || "",
      phoneNumber: formatKenyanPhoneNumber(data.phoneNumber),
      additionalInstructions: data.additionalInstructions || "",
    };
  }

  
  return {
    name: data.name,
    county: data.state || "Nairobi", // Default to Nairobi if no state
    constituency: "",
    ward: "",
    estate: data.city || "", // Use city as estate
    landmark: "",
    building: "",
    street: data.street || "",
    phoneNumber: formatKenyanPhoneNumber(data.phoneNumber),
    additionalInstructions: "",
  };
};

// Format Kenyan phone numbers
const formatKenyanPhoneNumber = (phone) => {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0") && digits.length === 10) {
    return digits; // Keep as 07XXXXXXXX for display
  }
  if (digits.startsWith("254") && digits.length === 12) {
    return "0" + digits.substring(3); // Convert to 07XXXXXXXX for display
  }
  if (digits.length === 9) {
    return "0" + digits; // Convert to 07XXXXXXXX
  }
  return phone;
};

export const deleteAddressAPI = async (id) => {
  const url = API_BASE_URL + `/api/address/${id}`;
  try {
    const response = await axios.delete(url, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete address");
  }
};

export const fetchOrderAPI = async () => {
  const url = API_BASE_URL + `/api/order/user`;
  try {
    const response = await axios.get(url, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch orders");
  }
};

// Add to api/userInfo.js
// export const updateProfileAPI = async (data) => {
//   const url = API_BASE_URL + "/api/user/profile";
//   try {
//     const response = await axios.put(url, data, {
//       headers: getHeaders(),
//     });
//     return response?.data;
//   } catch (err) {
//     const errorMessage =
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       "Failed to update profile";
//     throw new Error(errorMessage);
//   }
// };

export const cancelOrderAPI = async (id) => {
  const url = API_BASE_URL + `/api/order/cancel/${id}`;
  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: getHeaders(),
      }
    );
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to cancel order");
  }
};

// Additional utility functions for Kenyan addresses
export const validateKenyanPhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return (
    (digits.startsWith("07") && digits.length === 10) ||
    (digits.startsWith("7") && digits.length === 9) ||
    (digits.startsWith("254") && digits.length === 12)
  );
};

export const getKenyanCounties = () => {
  return [
    "Nairobi", "Mombasa","Kisumu","Nakuru","Kiambu","Eldoret","Machakos","Meru","Nyeri", "Garissa", "Wajir", "Mandera",    "Marsabit",
    "Isiolo", "Kitui", "Embu", "Kirinyaga", "Murang'a","Turkana","West Pokot","Samburu","Trans Nzoia",
    "Uasin Gishu", "Elgeyo-Marakwet","Nandi","Baringo","Laikipia","Narok","Kajiado","Kericho", "Bomet",
    "Kakamega","Vihiga","Bungoma","Busia", "Siaya","Homa Bay","Migori","Kisii", "Nyamira","Lamu","Tana River",
    "Taita-Taveta", "Kwale", "Kilifi",
  ];
};
