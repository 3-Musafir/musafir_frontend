import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import apiEndpoints from "@/config/apiEndpoints";
import { ROLES, ROUTES_CONSTANTS } from "@/config/constants";

const safePath = (value: string | string[] | undefined) => {
  if (typeof value !== "string") return null;
  return /^\/(?!\/)/.test(value) ? value : null;
};

export default function AuthCallback() {
  const router = useRouter();
  const { status } = useSession();
  const [message, setMessage] = useState("Finalizing your sign-in…");

  const nextPath = useMemo(() => {
    if (!router.isReady) return null;
    return safePath(router.query.next);
  }, [router.isReady, router.query.next]);

  useEffect(() => {
    if (!router.isReady) return;
    if (status === "loading") return;

    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) {
        router.replace(`/login?callbackUrl=${encodeURIComponent(nextPath || "/")}`);
      }
    }, 8000);

    const routeUser = async () => {
      try {
        const res = await api.get(apiEndpoints.USER.GET_ME);
        const userPayload = (res as any)?.data ?? res;
        const roles = Array.isArray(userPayload?.roles) ? userPayload.roles : [];

        const fallback = roles.includes(ROLES.ADMIN)
          ? ROUTES_CONSTANTS.ADMIN_DASHBOARD
          : ROUTES_CONSTANTS.HOME;
        const destination = nextPath || fallback;

        if (!cancelled) {
          router.replace(destination);
        }
      } catch (error) {
        console.error("Auth callback failed:", error);
        if (!cancelled) {
          setMessage("We hit a snag. Redirecting to login…");
          router.replace(`/login?callbackUrl=${encodeURIComponent(nextPath || "/")}`);
        }
      } finally {
        clearTimeout(timeout);
      }
    };

    if (status === "authenticated") {
      // Promote the pending Google flag now that we have a valid session.
      // This ensures isGoogleLogin is never set without a real session.
      if (typeof window !== "undefined" && localStorage.getItem("isGoogleLoginPending")) {
        localStorage.setItem("isGoogleLogin", "true");
        localStorage.removeItem("isGoogleLoginPending");
      }
      routeUser();
      return () => {
        cancelled = true;
        clearTimeout(timeout);
      };
    }

    if (status === "unauthenticated") {
      // Sign-in failed — clean up the pending flag so downstream pages
      // don't think we're in a Google flow without a session.
      if (typeof window !== "undefined") {
        localStorage.removeItem("isGoogleLoginPending");
      }
      router.replace(`/login?callbackUrl=${encodeURIComponent(nextPath || "/")}`);
      return () => {
        cancelled = true;
        clearTimeout(timeout);
      };
    }

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [nextPath, router, router.isReady, status]);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-pulse rounded-full bg-brand-primary" />
          <p className="text-sm font-semibold text-gray-800">{message}</p>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          This usually takes just a moment.
        </p>
      </div>
    </div>
  );
}
