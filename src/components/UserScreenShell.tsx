"use client";

import { ReactNode } from "react";

interface UserScreenShellProps {
  children: ReactNode;
}

export default function UserScreenShell({ children }: UserScreenShellProps) {
  return (
    <div className="min-h-screen w-full">
      <div className="min-h-screen w-full max-w-md mx-auto">{children}</div>
    </div>
  );
}
