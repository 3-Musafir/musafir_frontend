/**
 * Centralized error code to user-friendly message mapping.
 *
 * Security principles:
 * - 4xx errors with known codes get specific, actionable messages
 * - 5xx or unknown codes get generic messages
 * - Never expose internal details, stack traces, or sensitive info
 */

/**
 * Map of error codes to user-friendly messages.
 * These messages should be:
 * - Clear and actionable
 * - Written for end users (non-technical)
 * - Safe to display (no internal details)
 */
const ERROR_CODE_MESSAGES: Record<string, string> = {
  // ============================================
  // AUTHENTICATION & AUTHORIZATION
  // ============================================
  AUTH_UNAUTHORIZED: 'Please log in to continue your journey.',
  AUTH_SESSION_EXPIRED: 'Your session has timed out. Please log in again to continue.',
  AUTH_PERMISSION_DENIED: 'You don’t have access to this action on Musafir.',
  AUTH_TOKEN_INVALID: 'Your session is invalid. Please log in again.',
  AUTH_TOKEN_MISSING: 'Please log in to access this feature.',
  AUTH_INSUFFICIENT_ROLE: 'You do not have the required role for this action.',
  AUTH_USER_LOGGED_OUT: 'You have been logged out. Please log in again.',
  AUTH_BAD_REQUEST: 'Authentication failed. Please try again.',

  // ============================================
  // USER & ACCOUNT
  // ============================================
  USER_NOT_FOUND: 'Account not found. Please check your details or sign up.',
  USER_EMAIL_REQUIRED: 'Please provide your email address.',
  USER_EMAIL_ALREADY_EXISTS: 'An account with this email already exists. Please log in or use a different email.',
  USER_EMAIL_NOT_FOUND: 'No account found with this email address.',
  USER_PHONE_REQUIRED: 'Please provide your phone number.',
  USER_MULTIPLE_PHONE_MATCHES: 'Multiple accounts found. Please enter your full phone number or email.',
  USER_ACCOUNT_EXISTS: 'An account already exists. Please log in.',
  USER_BLOCKED: 'Your account has been temporarily blocked. Please try again later.',
  USER_BLOCKED_TEMPORARY: 'Too many attempts. Please try again in a few hours.',
  USER_INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  USER_EMAIL_TAKEN: 'This email is already in use by another account.',
  PROFILE_INCOMPLETE: 'Please complete your profile (gender, phone, city) to continue.',

  // ============================================
  // PASSWORD RESET
  // ============================================
  PASSWORD_USER_NOT_VERIFIED: 'Please verify your account before resetting your password.',
  PASSWORD_INCORRECT: 'Your current password is incorrect.',
  PASSWORD_MISMATCH: 'New password and confirmation do not match.',
  PASSWORD_SAME_AS_OLD: 'New password must be different from your current password.',
  PASSWORD_RESET_TOKEN_INVALID: 'Invalid password reset link. Please request a new one.',
  PASSWORD_RESET_LINK_EXPIRED: 'This password reset link has expired. Please request a new one.',

  // ============================================
  // VERIFICATION & REFERRALS
  // ============================================
  REFERRAL_CODES_REQUIRED: 'To get verified as a Musafir, please add referral codes from two verified Musafirs.',
  REFERRAL_CODES_MUST_DIFFER:
    'Both referral codes need to be from different Musafirs. Please use two different verified Musafirs.',
  REFERRAL_CANNOT_USE_OWN:
    'You can’t use your own referral code. Ask other verified Musafirs from the community to vouch for you.',
  REFERRAL_GENDER_REQUIREMENT:
    'For community safety, you’ll need referral codes from at least one male and one female verified Musafir.',
  VERIFICATION_REQUIRED:
    'Please complete your Musafir verification to continue.',
  VERIFICATION_PENDING:
    'Your Musafir verification is under review. We’ll notify you once it’s approved.',

  REFERRAL_USER_NOT_VERIFIED: 'Invalid referral codes. Please ask verified Musafirs for their codes.',
  REFERRAL_SAME_USER: 'Both referral codes belong to the same person. Please use codes from two different verified Musafirs.',
  REFERRAL_CANNOT_VERIFY_SELF: 'You cannot use your own account to verify yourself. Please ask other verified Musafirs for their codes.',
  REFERRAL_NOT_FOUND: 'Referral code not found. Please check the code and try again.',

  VERIFICATION_NOT_FOUND: 'Verification record not found.',
  VERIFICATION_REJECTED: 'Your verification was not approved. Please re-submit with different details.',
  VERIFICATION_VIDEO_UPLOAD_FAILED: 'Failed to upload verification video. Please try again.',

  // ============================================
  // FLAGSHIP / TRIPS
  // ============================================
  FLAGSHIP_NOT_FOUND:
    'We couldn’t find this trip. It might have been updated, filled, or removed.',
  WAITLIST_SEATS_FULL:
    'Seats filled up before you could confirm. You’ll stay on the waitlist for the next opening.',
  CANCEL_NOT_ELIGIBLE:
    'Only confirmed seats can be cancelled. Please check your trip status.',
  FLAGSHIP_INVALID_DATE_RANGE: 'Invalid date range. Start date must be before end date.',
  FLAGSHIP_FILE_UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  FLAGSHIP_QUERY_SEND_FAILED: 'Failed to send your query. Please try again later.',

  // ============================================
  // REGISTRATION
  // ============================================
  REGISTRATION_NOT_FOUND: 'Registration not found. Please check your bookings.',
  REGISTRATION_ID_REQUIRED: 'Registration ID is required.',

  // ============================================
  // WAITLIST
  // ============================================
  WAITLIST_AUTH_REQUIRED: 'Please log in to respond to your waitlist offer.',
  WAITLIST_NOT_ACTIVE: 'This registration is no longer on the waitlist.',
  WAITLIST_OFFER_MISSING: 'No active waitlist offer found for this registration.',
  WAITLIST_OFFER_EXPIRED: 'This waitlist offer has expired.',
  WAITLIST_OFFER_STATE_CHANGED: 'This offer has changed. Please refresh and try again.',
  WAITLIST_NOT_OWNER: 'You can only respond to your own waitlist offers.',

  // ============================================
  // CANCELLATION
  // ============================================
  CANCEL_AUTH_REQUIRED: 'Please log in to cancel your seat.',
  CANCEL_STATE_CHANGED: 'Unable to cancel. Please refresh and try again.',
  CANCEL_NOT_OWNER: 'You can only cancel your own seat.',

  // ============================================
  // PAYMENT
  // ============================================
  PAYMENT_NOT_FOUND: 'Payment record not found.',
  PAYMENT_NOT_OWNER: 'You can only pay for your own registration.',
  PAYMENT_USER_NOT_FOUND: 'Unable to process payment. User not found.',
  PAYMENT_FAILED: 'Payment failed. Please try again or use a different method.',
  PAYMENT_VALIDATION_FAILED: 'Payment validation failed. Please check your details.',

  // ============================================
  // REFUND
  // ============================================
  REFUND_AUTH_REQUIRED: 'Please log in to request a refund.',
  REFUND_REGISTRATION_NOT_FOUND: 'Registration not found for refund request.',
  REFUND_NOT_OWNER: 'You can only request a refund for your own registration.',
  REFUND_REQUIRES_CONFIRMATION: 'Only confirmed registrations can request a refund.',
  REFUND_REQUIRES_CANCELLATION: 'Please cancel your seat first before requesting a refund.',
  REFUND_ALREADY_REQUESTED: 'A refund request already exists for this registration.',
  REFUND_PAYMENT_NOT_APPROVED: 'Refunds can only be requested after your payment is approved.',
  REFUND_FLAGSHIP_NOT_FOUND: 'Trip not found for this registration.',
  REFUND_CREDIT_ZERO: 'No refund amount available for this registration.',
  REFUND_FAILED: 'Refund request failed. Please try again later.',

  // ============================================
  // WALLET
  // ============================================
  WALLET_AUTH_REQUIRED: 'Please log in to access your wallet.',
  WALLET_USER_ID_REQUIRED: 'User ID is required.',
  WALLET_TX_NOT_FOUND: 'Wallet transaction not found.',
  WALLET_INSUFFICIENT_BALANCE: 'Insufficient wallet balance for this transaction.',
  WALLET_VOID_INSUFFICIENT_BALANCE: 'Cannot reverse transaction due to insufficient balance.',
  WALLET_INVALID_AMOUNT: 'Invalid wallet amount.',
  WALLET_TX_VOID: 'This transaction has already been voided.',

  // ============================================
  // WALLET TOP-UP
  // ============================================
  TOPUP_AUTH_REQUIRED: 'Please log in to top up your wallet.',
  TOPUP_ADMIN_AUTH_REQUIRED: 'Admin authentication required.',
  TOPUP_NOT_FOUND: 'Top-up request not found.',
  TOPUP_ALREADY_PROCESSED: 'This top-up request has already been processed.',

  // ============================================
  // NOTIFICATION
  // ============================================
  NOTIFICATION_NOT_FOUND: 'Notification not found.',

  // ============================================
  // FEEDBACK
  // ============================================
  FEEDBACK_REGISTRATION_REQUIRED: 'Please select a trip to provide feedback.',
  FEEDBACK_REGISTRATION_NOT_FOUND: 'Registration not found for feedback.',
  FEEDBACK_CREATE_FAILED: 'Failed to submit feedback. Please try again later.',

  // ============================================
  // COMPANY PROFILE
  // ============================================
  COMPANY_PROFILE_NOT_FOUND: 'Company profile not found.',
  COMPANY_PROFILE_REQUIRED_FIELDS: 'Name and description are required.',
  COMPANY_PROFILE_LOGO_UPLOAD_FAILED: 'Failed to upload logo. Please try again.',
  COMPANY_PROFILE_SAVE_FAILED: 'Failed to save company profile. Please try again.',

  // ============================================
  // MAIL
  // ============================================
  MAIL_RECIPIENT_REQUIRED: 'Recipient email is required.',
  MAIL_CONFIG_MISSING: 'Email configuration error. Please contact support.',

  // ============================================
  // FAQ & RATING
  // ============================================
  FAQ_FETCH_FAILED: 'Failed to load FAQ. Please try again.',
  FAQ_CREATE_FAILED: 'Failed to create FAQ entry.',
  RATING_FETCH_FAILED: 'Failed to load ratings.',

  // ============================================
  // GENERIC ERRORS
  // ============================================
  VALIDATION_ERROR: 'Please check your input and try again.',
  BAD_REQUEST: 'Invalid request. Please try again.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'This action conflicts with existing data.',
  FORBIDDEN: 'You do not have permission for this action.',
  INTERNAL_SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
};

/**
 * Default message for unknown errors.
 * Used when we can't determine a specific user-friendly message.
 */
const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again later.';

/**
 * Patterns that indicate a technical/internal error message.
 * These should never be shown to users.
 */
const TECHNICAL_PATTERNS = [
  'Error:',
  'Exception',
  'TypeError',
  'ReferenceError',
  'SyntaxError',
  'Cannot read',
  'undefined is not',
  'null is not',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'MongoError',
  'ValidationError',
  'CastError',
  'stack trace',
  'at Object.',
  'at Module.',
  'at Function.',
];

/**
 * Check if a message looks like a technical/internal error.
 */
function isTechnicalMessage(message: string): boolean {
  if (!message || typeof message !== 'string') return true;
  if (message.length > 300) return true;
  return TECHNICAL_PATTERNS.some((pattern) =>
    message.toLowerCase().includes(pattern.toLowerCase()),
  );
}

/**
 * Maps an API error to a user-friendly message.
 *
 * Priority order:
 * 1. userMessage from backend (highest priority - explicitly set for users)
 * 2. Error code mapping (machine-readable code to friendly message)
 * 3. Backend message (only if 4xx and looks safe)
 * 4. Generic fallback message
 *
 * @param error - The error object from an API call
 * @returns A user-friendly error message
 */
export function mapErrorToUserMessage(error: unknown): string {
  if (!error) {
    return GENERIC_ERROR_MESSAGE;
  }

  const errorObj = error as {
    response?: {
      data?: {
        code?: string;
        message?: string;
        userMessage?: string;
      };
      status?: number;
    };
    message?: string;
  };

  // 1. Check for userMessage from backend (highest priority)
  const userMessage = errorObj?.response?.data?.userMessage;
  if (userMessage && typeof userMessage === 'string' && !isTechnicalMessage(userMessage)) {
    return userMessage;
  }

  // 2. Check for error code mapping
  const code = errorObj?.response?.data?.code;
  if (code && typeof code === 'string' && ERROR_CODE_MESSAGES[code]) {
    return ERROR_CODE_MESSAGES[code];
  }

  // 3. For 4xx errors, consider using backend message if it looks safe
  const statusCode = errorObj?.response?.status;
  const backendMessage = errorObj?.response?.data?.message;

  if (
    statusCode &&
    statusCode >= 400 &&
    statusCode < 500 &&
    backendMessage &&
    typeof backendMessage === 'string' &&
    !isTechnicalMessage(backendMessage)
  ) {
    return backendMessage;
  }

  // 4. Fall back to generic message
  return GENERIC_ERROR_MESSAGE;
}

/**
 * Get the error code from an API error (if available).
 * Useful for logging or conditional handling.
 *
 * @param error - The error object from an API call
 * @returns The error code or null
 */
export function getErrorCode(error: unknown): string | null {
  const errorObj = error as {
    response?: {
      data?: {
        code?: string;
      };
    };
  };

  return errorObj?.response?.data?.code || null;
}

/**
 * Check if an error has a specific error code.
 *
 * @param error - The error object from an API call
 * @param code - The error code to check for
 * @returns True if the error has the specified code
 */
export function hasErrorCode(error: unknown, code: string): boolean {
  return getErrorCode(error) === code;
}
