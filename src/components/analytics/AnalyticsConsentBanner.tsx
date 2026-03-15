"use client";

import { useEffect, useState } from "react";
import {
  AnalyticsConsentValue,
  CONSENT_EVENT,
  getStoredConsent,
  setStoredConsent,
} from "@/lib/analytics/consent";
import { isClarityEnabled } from "@/lib/analytics/clarity";

export default function AnalyticsConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<AnalyticsConsentValue | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isClarityEnabled()) return;
    setConsent(getStoredConsent());
    const handler = () => setConsent(getStoredConsent());
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, [mounted]);

  if (!mounted || !isClarityEnabled() || consent) return null;

  const handleAccept = () => {
    setStoredConsent("granted");
    setConsent("granted");
  };

  const handleDecline = () => {
    setStoredConsent("denied");
    setConsent("denied");
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-700">
          We use privacy-respecting analytics (session replay and usage insights)
          to improve 3Musafir. This is only enabled after you consent.
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDecline}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
