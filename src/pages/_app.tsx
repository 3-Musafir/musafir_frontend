import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import {RecoilRoot} from 'recoil';
import AlertContainer from './alert';
import { Toaster } from "@/components/ui/toaster";
import { NotificationsProvider } from "@/context/NotificationsProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <SessionProvider
      session={pageProps.session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      <RecoilRoot>
        <NotificationsProvider>
          <Component {...pageProps} />
        </NotificationsProvider>
        <AlertContainer />
        <Toaster />
      </RecoilRoot>
    </SessionProvider>

    </>
  ) 
}
