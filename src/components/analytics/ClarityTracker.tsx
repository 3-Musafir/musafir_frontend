"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  AnalyticsConsentValue,
  CONSENT_EVENT,
  getStoredConsent,
} from "@/lib/analytics/consent";
import {
  identifyClarityUser,
  initClarity,
  isClarityEnabled,
  isExcludedPath,
  setClarityConsent,
  setClarityTag,
} from "@/lib/analytics/clarity";

export default function ClarityTracker() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [consent, setConsent] = useState<AnalyticsConsentValue | null>(null);

  useEffect(() => {
    if (!isClarityEnabled()) return;
    setConsent(getStoredConsent());
    const handler = () => setConsent(getStoredConsent());
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);

  const roles = useMemo(() => {
    const user = session?.user as any;
    return Array.isArray(user?.roles) ? user.roles : [];
  }, [session]);

  const isStaff = roles.includes("admin");
  const pathname = (router.asPath || "").split("?")[0];

  useEffect(() => {
    if (!isClarityEnabled()) return;
    if (consent !== "granted") return;
    if (status === "loading") return;

    const didInit = initClarity({ pathname, isStaff });
    if (!didInit) return;

    setClarityConsent(true);

    const authState = status === "authenticated" ? "authenticated" : "anonymous";
    setClarityTag("auth_state", authState);
    setClarityTag("env", "prod");

    if (roles.length > 0) {
      setClarityTag("roles", roles);
    }

    const profileComplete = (session?.user as any)?.profileComplete;
    if (typeof profileComplete === "boolean") {
      setClarityTag("profile_complete", profileComplete ? "true" : "false");
    }

    if (status === "authenticated") {
      const userId = (session?.user as any)?.id;
      if (userId) {
        identifyClarityUser(String(userId));
      }
    }
  }, [consent, status, pathname, isStaff, roles, session]);

  useEffect(() => {
    if (!isClarityEnabled()) return;
    if (consent !== "granted") return;
    if (status === "loading") return;

    if (isStaff || isExcludedPath(pathname)) {
      setClarityConsent(false);
      return;
    }

    setClarityConsent(true);
  }, [consent, status, pathname, isStaff]);

  return null;
}
