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

    // Calculate hasRole if allowedRoles exist and currentRole is loaded
    const hasRole =
      allowedRoles && currentRole?.length > 0
        ? allowedRoles.some((role) => currentRole.includes(role))
        : true; // If no allowedRoles provided, or if roles aren't loaded yet, default to true. If we want to treat an empty roles array as unauthorized we can adjust it heres

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
          const response = await api.get(apiEndpoints.USER.GET_ME);
          const userData = (response as any)?.data ?? (response as any)?.data?.data;
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

    // While checking session or if not authorized, render nothing.
    if (status === "loading" || !session || !profileChecked) return null;
    if (allowedRoles && !hasRole) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
