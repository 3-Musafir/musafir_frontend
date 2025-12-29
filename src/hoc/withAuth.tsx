import { ComponentType, useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentUser, currentUserRoleState } from "@/store";
import api from "@/pages/api";
import apiEndpoints from "@/config/apiEndpoints";

interface WithAuthOptions {
  allowedRoles?: string[];
}

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: WithAuthOptions
) => {
  return function AuthComponent(props: P) {
    const currentRole = useRecoilValue(currentUserRoleState); // An array
    const setCurrentUser = useSetRecoilState(currentUser);

    const { data: session, status } = useSession();
    const router = useRouter();
    const allowedRoles = options?.allowedRoles;
    const [profileChecked, setProfileChecked] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);

    const sessionRoles = useMemo(() => {
      const roles = (session?.user as any)?.roles;
      return Array.isArray(roles) ? roles : [];
    }, [session]);

    const effectiveRoles = useMemo(() => {
      const merged = new Set<string>();
      sessionRoles.forEach((r) => merged.add(r));
      if (Array.isArray(currentRole)) {
        currentRole.forEach((r) => merged.add(r));
      }
      return Array.from(merged);
    }, [currentRole, sessionRoles]);

    const rolesLoaded = effectiveRoles.length > 0;
    const hasRole = allowedRoles
      ? rolesLoaded && allowedRoles.some((role) => effectiveRoles.includes(role))
      : true;

    const handleSignOut = async () => {
      const base = process.env.NEXT_PUBLIC_AUTH_URL?.trim();
      const callbackUrl = base ? `${base}/login` : "/login";
      await signOut({ callbackUrl });
    };

    useEffect(() => {
      if (status === "loading") return; // Avoid redirecting while checking session

      // If NextAuth has definitively determined there's no session, just route
      // to login (do not signOut here to avoid callback loops during OAuth
      // hydration).
      if (status === "unauthenticated" && !session) {
        router.replace("/login");
        return;
      }

      if (!session) return; // Wait for session to hydrate

      let cancelled = false;

      const fetchProfile = async () => {
        try {
          // api.get returns the axios data payload directly; /user/me wraps
          // the user object under `data`.
          const { data: userData } = await api.get(apiEndpoints.USER.GET_ME);
          // Backend wraps the user under `data`; fall back to the response itself.
          const userPayload = (userData as any)?.data ?? userData;
          if (userPayload) {
            setCurrentUser(userPayload);
            const isProfileComplete = Boolean(
              (userPayload as any).profileComplete
            );
            const completionPath = "/userSettings";
            const isOnCompletionPage = router.asPath.startsWith(completionPath);

            if (!isProfileComplete && !isOnCompletionPage) {
              router.replace(`${completionPath}?forceEdit=true`);
              return;
            }
          }
        } catch (err) {
          console.error("Failed to fetch profile:", err);
          handleSignOut();
        } finally {
          if (!cancelled) {
            setProfileChecked(true);
          }
        }
      };

      fetchProfile();

      return () => {
        cancelled = true;
      };
    }, [session, status, router, setCurrentUser]);

    useEffect(() => {
      if (!profileChecked) return;
      if (!allowedRoles) return;
      if (!rolesLoaded) return; // Wait until we have roles from session or /user/me

      if (!hasRole) {
        setUnauthorized(true);
        router.replace("/login");
      }
    }, [allowedRoles, hasRole, profileChecked, rolesLoaded, router]);

    const shouldWaitForRoles = Boolean(allowedRoles);

    // While checking session or redirecting, render nothing.
    if (
      status === "loading" ||
      !session ||
      !profileChecked ||
      (shouldWaitForRoles && !rolesLoaded) ||
      unauthorized
    ) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
