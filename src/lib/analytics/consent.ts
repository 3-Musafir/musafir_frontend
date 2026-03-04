export type AnalyticsConsentValue = "granted" | "denied";

export const CONSENT_KEY = "analytics_consent";
export const CONSENT_EVENT = "analytics-consent-changed";

export const getStoredConsent = (): AnalyticsConsentValue | null => {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
};

export const setStoredConsent = (value: AnalyticsConsentValue) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
};
