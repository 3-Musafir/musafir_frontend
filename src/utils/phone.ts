const digitsOnly = (value: string) => value.replace(/\D/g, '');

// Normalize user input while typing (max 10 digits, strip non-digits)
export const sanitizePhoneInput = (value: string) => digitsOnly(value).slice(0, 10);

// Convert a stored phone (usually 11 digits with leading 0) to 10-digit input
export const inputFromStoredPhone = (value: string) => {
  const digits = digitsOnly(value);
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1, 11);
  }
  return digits.slice(0, 10);
};

// Format 10 or 11 digit phone into canonical API shape (ensure leading 0)
export const formatPhoneForApi = (value: string) => {
  const digits = digitsOnly(value);
  if (!digits) return '';
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits;
  }
  if (digits.length === 10) {
    return `0${digits}`;
  }
  // Fallback: return trimmed to 11 to avoid sending overly long numbers
  return digits.slice(0, 11);
};

// Validate phone input for 10 digits (signup/settings requirement)
export const validatePhoneDigits = (value: string, label = 'Phone'): string | null => {
  const digits = digitsOnly(value);
  if (digits.length !== 10) {
    return `${label} must be exactly 10 digits.`;
  }
  return null;
};

export const hasTenOrElevenDigits = (value: string) => {
  const digits = digitsOnly(value);
  return digits.length === 10 || digits.length === 11;
};

