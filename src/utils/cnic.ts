const digitsOnly = (value: string) => value.replace(/\D/g, '');

// Format CNIC as xxxxx-xxxxxxx-x while typing (max 13 digits)
export const formatCnicInput = (value: string) => {
  const digits = digitsOnly(value).slice(0, 13);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 12);
  const part3 = digits.slice(12, 13);
  return [part1, part2, part3].filter(Boolean).join('-');
};

export const validateCnicFormat = (value: string): string | null => {
  if (!/^\d{5}-\d{7}-\d{1}$/.test(value)) {
    return 'CNIC must be in xxxxx-xxxxxxx-x format';
  }
  return null;
};

export const cnicDigits = (value: string) => digitsOnly(value).slice(0, 13);

