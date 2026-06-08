"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const publicPageGutter = "px-4 sm:px-6 lg:px-8 xl:px-10";
export const publicPageContainer = "mx-auto w-full max-w-6xl";
export const publicSectionSpacing = "py-8 md:py-10 lg:py-14";

type PublicPageContainerProps = {
  children: ReactNode;
  as?: "div" | "main" | "section";
  className?: string;
  fullBleed?: boolean;
};

export function PublicPageContainer({
  children,
  as: Component = "div",
  className,
  fullBleed = false,
}: PublicPageContainerProps) {
  return (
    <Component
      className={cn(
        "w-full",
        !fullBleed && publicPageGutter,
        !fullBleed && publicSectionSpacing,
        className,
      )}
    >
      {fullBleed ? (
        children
      ) : (
        <div className={publicPageContainer}>{children}</div>
      )}
    </Component>
  );
}
