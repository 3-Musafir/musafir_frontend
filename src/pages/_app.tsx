import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useMemo } from "react";
import { useRouter } from "next/router";
import {RecoilRoot} from 'recoil';
import AlertContainer from './alert';
import { Toaster } from "@/components/ui/toaster";
import { NotificationsProvider } from "@/context/NotificationsProvider";
import UserScreenShell from "@/components/UserScreenShell";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const useUserShell = useMemo(() => {
    const pathname = router.pathname || "";
    const adminPrefixes = [
      "/admin",
      "/dashboard",
      "/flagship/create",
      "/flagship/payment",
      "/flagship/seats",
    ];
    return !adminPrefixes.some((prefix) => pathname.startsWith(prefix));
  }, [router.pathname]);

  return (
    <>
    <SessionProvider
      session={pageProps.session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      <RecoilRoot>
        <NotificationsProvider>
          {useUserShell ? (
            <UserScreenShell>
              <Component {...pageProps} />
            </UserScreenShell>
          ) : (
            <Component {...pageProps} />
          )}
        </NotificationsProvider>
        <AlertContainer />
        <Toaster />
      </RecoilRoot>
    </SessionProvider>

    </>
  ) 
}
