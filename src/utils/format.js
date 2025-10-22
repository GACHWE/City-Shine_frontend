export const formatCurrency = (amount) => {
  if (amount == null) return "KES 0.00";
  // Handle BigDecimal strings from backend
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return isNaN(num) ? "KES 0.00" : `KES ${num.toFixed(2)}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "Invalid date"
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

export const formatOrderId = (orderId) => {
  return orderId ? `#${orderId.substring(0, 8).toUpperCase()}` : "#N/A";
};

export const formatKenyanPhoneNumber = (phone) => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) {
    return "254" + digits.substring(1);
  }
  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }
  if (digits.length === 9 && (digits.startsWith("7") || digits.startsWith("1"))) {
    return "254" + digits;
  }
  return digits;
};

export const validateKenyanPhone = (phone) => {
  if (!phone) return false;
  const normalized = formatKenyanPhoneNumber(phone);
  // Matches 2547XXXXXXXX or 2541XXXXXXXX
  return /^254(7\d{8}|1\d{8})$/.test(normalized);
};

export const validateCodEligibility = (county) => {
  return county?.toLowerCase() === "nairobi";
};