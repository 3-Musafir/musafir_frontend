"use client";

import { ReactNode } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";

interface UserScreenShellProps {
  children: ReactNode;
}

export default function UserScreenShell({ children }: UserScreenShellProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = router.pathname || "";
  const excludedPaths = ["/home", "/login"];
  const isExcludedPath = excludedPaths.some((path) => pathname.startsWith(path));
  const isLoggedIn = Boolean(session?.user);
  const shouldShowFooter = !isLoggedIn && !isExcludedPath;

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/*
        Full width on all screen sizes.
        Content uses responsive padding (px-4 md:px-6 lg:px-8 xl:px-10) for breathing room.
        No max-width constraint - content fills the available space.
      */}
      <div className="min-h-screen w-full">
        {children}
        {shouldShowFooter ? <Footer /> : null}
      </div>
    </div>
  );
}
