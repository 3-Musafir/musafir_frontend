// eslint-disable-next-line import/no-anonymous-default-export
export default {
  APP_URL: process.env.NEXT_PUBLIC_API_URL,
};

export const ROUTES_CONSTANTS = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFICATION_REQUEST: '/verification',
  ADMIN_DASHBOARD: '/admin',
  HOME: '/home',
  FLAGSHIP: {
    CREATE: '/flagship/create',
    CONTENT: '/flagship/create/content',
    PRICING: '/flagship/create/pricing',
    IMP_DATES: '/flagship/create/dates',
    DISCOUNTS: '/flagship/create/discounts',
    SEATS: '/flagship/create/seats',
    PAYMENT: '/flagship/payment',
    SUCCESS: '/flagship/create/success',
  },
};

export enum ROLES {
  ADMIN = 'admin',
  MUSAFIR = 'musafir',
}

export const DESTINATIONS = [
  { value: 'hunza', label: 'Hunza Valley' },
  { value: 'skardu', label: 'Skardu Valley' },
  { value: 'chitral', label: 'Chitral Valley' },
  { value: 'kalash', label: 'Kalash Valley' },
  { value: 'sharan', label: 'Sharan Forest' },
  { value: 'shogran', label: 'Shogran' },
  { value: 'neelum', label: 'Neelum Valley Kashmir' },
  { value: 'kaghan', label: 'Kaghan Valley' },
  { value: 'naran', label: 'Naran Valley' },
];

export const FLAGSHIP_STATUS = {
  UNPUBLISHED: 'unpublished',
  PUBLISHED: 'published',
  COMPLETED: 'completed',
};

// Progress steps
export const steps = [
  { label: 'Basic Info', route: ROUTES_CONSTANTS.FLAGSHIP.CREATE },
  { label: 'Content', route: ROUTES_CONSTANTS.FLAGSHIP.CONTENT },
  { label: 'Pricing', route: ROUTES_CONSTANTS.FLAGSHIP.PRICING },
  { label: 'Seats', route: ROUTES_CONSTANTS.FLAGSHIP.SEATS },
  { label: 'Imp Dates', route: ROUTES_CONSTANTS.FLAGSHIP.IMP_DATES },
  { label: 'Discounts', route: ROUTES_CONSTANTS.FLAGSHIP.DISCOUNTS },
  { label: 'Payments', route: ROUTES_CONSTANTS.FLAGSHIP.PAYMENT },
];
