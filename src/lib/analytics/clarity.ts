import Clarity from "@microsoft/clarity";
import { getStoredConsent } from "./consent";

let initialized = false;

const isBrowser = () => typeof window !== "undefined";

export const isClarityEnabled = () => {
  if (!isBrowser()) return false;
  if (process.env.NEXT_PUBLIC_ENABLE_CLARITY !== "true") return false;
  if (!process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID) return false;
  return true;
};

export const isExcludedPath = (pathname?: string) => {
  const path = pathname ?? (isBrowser() ? window.location.pathname : "");
  if (!path) return false;
  return path.startsWith("/admin") || path.startsWith("/dashboard");
};

export const initClarity = (options?: { pathname?: string; isStaff?: boolean }) => {
  if (!isClarityEnabled()) return false;
  if (options?.isStaff) return false;
  if (isExcludedPath(options?.pathname)) return false;
  if (initialized) return true;

  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (!projectId) return false;

  Clarity.init(projectId);
  initialized = true;
  return true;
};

export const setClarityConsent = (granted: boolean) => {
  if (!isClarityEnabled() || !initialized) return;
  Clarity.consentV2({
    ad_Storage: "denied",
    analytics_Storage: granted ? "granted" : "denied",
  });
};

const hasConsent = () => getStoredConsent() === "granted";

export const setClarityTag = (key: string, value: string | string[]) => {
  if (!isClarityEnabled() || !initialized || !hasConsent()) return;
  Clarity.setTag(key, value);
};

export const identifyClarityUser = (userId: string) => {
  if (!isClarityEnabled() || !initialized || !hasConsent()) return;
  if (!userId) return;
  Clarity.identify(userId);
};

export const trackClarityEvent = (eventName: string) => {
  if (!isClarityEnabled() || !initialized || !hasConsent()) return;
  if (!eventName) return;
  Clarity.event(eventName);
};
