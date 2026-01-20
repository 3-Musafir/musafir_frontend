const endpoints = {
  TOKEN_VERIFY: "user/verify-token",
  LOGOUT: "/user/logout",
  SIGNUP: "/user/register",
  CREATE_GOOGLE: "/user/create",
  VERIFY_EMAIL: "/user/verify-email",
  CHECK_EMAIL_AVAILABILITY: "/user/check-email-availability",
  REQUEST_VERIFICATION: "/user/request-verification",
  FIND_USER: "/user/find-user",
  VERIFY_MUSAFIR_EMAIL: "/user/verify-musafir-email",
  FLAGSHIP: {
    FILTER: "/flagship",
    CREATE: "/flagship",
    UPDATE: "/flagship",
    GET: "/flagship/getByID",
    TRIP_QUERY: "/flagship/tripQuery",
  },
  REGISTRATION: {
    CREATE: "/registration",
    GET_PAST_PASSPORT: "/registration/pastPassport",
    GET_UPCOMING_PASSPORT: "/registration/upcomingPassport",
    SEND_RE_EVALUATE_REQUEST_TO_JURY: "/registration/reEvaluateRequestToJury",
    GET_REGISTRATION_BY_ID: "/registration/getRegistrationById",
    CANCEL_SEAT: (registrationId: string) => `/registration/${registrationId}/cancel`,
  },
  FEEDBACK: {
    CREATE: "/feedback/:registrationId",
  },
  FAQ: {
    GET: "/faq",
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL: "/notifications/read-all",
  },
  COMPANY_PROFILE: {
    GET: "/company-profile",
    UPDATE: "/company-profile",
  },
  RATING: {
    GET: "/rating/:flagshipId",
    GET_TOP_FIVE: "/rating/top-five",
  },
  USER: {
    GET_ME: "/user/me",
    UPDATE_ME: "/user/me",
    RESET_PASSWORD: "/user/reset-password",
    FORGOT_PASSWORD: "/user/forgot-password",
  },
};
export default endpoints;
