/**
 * Enum for registration status
 * Must stay in sync with musafir_backend/src/constants/registration-status.enum.ts
 */
export enum RegistrationStatus {
  NEW = 'new',
  ONBOARDING = 'onboarding',
  WAITLISTED = 'waitlisted',
  PAYMENT = 'payment',
  CONFIRMED = 'confirmed',
}
