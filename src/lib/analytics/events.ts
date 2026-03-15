export const CLARITY_EVENTS = {
  SIGNUP_EMAIL_SUBMIT: "signup_email_submit",
  SIGNUP_GOOGLE_START: "signup_google_start",
  SIGNUP_PROFILE_SUBMIT: "signup_profile_submit",
  SIGNUP_COMPLETE: "signup_complete",
  LOGIN_SUBMIT: "login_submit",
  LOGIN_SUCCESS: "login_success",
  LOGIN_ERROR: "login_error",
  LOGIN_GOOGLE_START: "login_google_start",
  CHECKOUT_START: "checkout_start",
  VERIFICATION_START: "verification_start",
  PAYMENT_QUOTE_LOADED: "payment_quote_loaded",
  PAYMENT_SUBMIT_SUCCESS: "payment_submit_success",
  PAYMENT_SUBMIT_FAILED: "payment_submit_failed",
  REFUND_SUBMIT: "refund_submit",
} as const;

export type ClarityEventName = typeof CLARITY_EVENTS[keyof typeof CLARITY_EVENTS];
