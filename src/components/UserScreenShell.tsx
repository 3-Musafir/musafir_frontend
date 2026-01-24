"use client";

import { ReactNode } from "react";

interface UserScreenShellProps {
  children: ReactNode;
}

export default function UserScreenShell({ children }: UserScreenShellProps) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/*
        Full width on all screen sizes.
        Content uses responsive padding (px-4 md:px-6 lg:px-8 xl:px-10) for breathing room.
        No max-width constraint - content fills the available space.
      */}
      <div className="min-h-screen w-full">
        {children}
      </div>
    </div>
  );
}
