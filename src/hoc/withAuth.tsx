import { ComponentType, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { currentUserRoleState } from "@/store";
import { ROUTES_CONSTANTS } from "@/config/constants";

interface WithAuthOptions {
  allowedRoles?: string[];
}

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: WithAuthOptions
) => {
  return function AuthComponent(props: P) {
    const currentRole = useRecoilValue(currentUserRoleState); // An array

    const { data: session, status } = useSession();
    const router = useRouter();
    const allowedRoles = options?.allowedRoles;

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
      }
      // else if (allowedRoles && currentRole.length > 0 && !hasRole) {
      //   // Redirect if the user's roles do not match
      //   router.push('/unauthorized');
      // }
    }, [session, status, router, allowedRoles, currentRole, hasRole]);

    // While checking session or if not authorized, render nothing.
    if (status === "loading" || !session) return null;
    if (allowedRoles && !hasRole) return null;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
