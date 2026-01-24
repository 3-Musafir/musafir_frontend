"use client";

import { ReactNode } from "react";

interface UserScreenShellProps {
  children: ReactNode;
}

export default function UserScreenShell({ children }: UserScreenShellProps) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/*
        Mobile (0-767px): Full width, no max constraint
        Tablet (768px+): Centered with max-w-3xl (768px)
        Desktop (1024px+): Centered with max-w-6xl (1152px)
      */}
      <div className="min-h-screen w-full md:max-w-3xl lg:max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}
