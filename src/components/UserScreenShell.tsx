"use client";

import { ReactNode } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";
import PublicHeader from "@/components/header/PublicHeader";

interface UserScreenShellProps {
  children: ReactNode;
}

export default function UserScreenShell({ children }: UserScreenShellProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const rawPath = (router.asPath || "/").split("?")[0].split("#")[0] || "/";
  const hideAuthCtaPaths = ["/launch"];
  const shouldHideAuthCta = hideAuthCtaPaths.some((path) => rawPath.startsWith(path));
  const shouldShowFooter = !isLoggedIn && rawPath !== "/login";
  const shouldShowPublicHeader =
    rawPath !== "/login" && !rawPath.startsWith("/signup");

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      {shouldShowPublicHeader ? <PublicHeader hideAuthCta={shouldHideAuthCta} /> : null}
      <div className="min-h-screen w-full">
        {children}
        {shouldShowFooter ? <Footer /> : null}
      </div>
    </div>
  );
}
