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
  const fullBleedPaths = ["/trust", "/about-3musafir"];
  const shouldHideAuthCta = hideAuthCtaPaths.some((path) => rawPath.startsWith(path));
  const isFullBleed = fullBleedPaths.includes(rawPath);
  const shouldShowFooter = !isLoggedIn && rawPath !== "/login";
  const shouldShowPublicHeader =
    rawPath !== "/login" && !rawPath.startsWith("/signup");

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/*
        Full width on all screen sizes.
        Content uses responsive padding (px-4 md:px-6 lg:px-8 xl:px-10) for breathing room.
        No max-width constraint - content fills the available space.
      */}
      {shouldShowPublicHeader ? <PublicHeader hideAuthCta={shouldHideAuthCta} /> : null}
      <div className={`min-h-screen w-full ${isFullBleed ? "pt-0" : "pt-4 md:pt-6"}`}>
        {children}
        {shouldShowFooter ? <Footer /> : null}
      </div>
    </div>
  );
}
