import { ComponentType, useEffect, useState } from "react";
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

    const rolesLoaded = Array.isArray(currentRole) && currentRole.length > 0;
    const hasRole = allowedRoles
      ? rolesLoaded && allowedRoles.some((role) => currentRole.includes(role))
      : true;

    const handleSignOut = async () => {
      await signOut({
        callbackUrl: `http://localhost:3000/login`,
      });
    };

    useEffect(() => {
      if (status === "loading") return; // Avoid redirecting while checking session

      if (!session) {
        handleSignOut(); // Redirect to login if no session
        return;
      }

      let cancelled = false;

      const fetchProfile = async () => {
        try {
          // api.get returns the axios data payload directly; /user/me wraps
          // the user object under `data`.
          const { data: userData } = await api.get(apiEndpoints.USER.GET_ME);
          if (userData) {
            setCurrentUser(userData);
            const isProfileComplete = Boolean(
              (userData as any).profileComplete
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

      if (!hasRole) {
        setUnauthorized(true);
        router.replace("/login");
      }
    }, [allowedRoles, hasRole, profileChecked, router]);

    // While checking session or redirecting, render nothing.
    if (status === "loading" || !session || !profileChecked || unauthorized) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
