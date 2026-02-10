"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyProfile } from "@/services/types/companyProfile";
import { cn } from "@/lib/utils";

type CompanyProfileHeroProps = {
  companyProfile: CompanyProfile | null;
  loading?: boolean;
  className?: string;
  fallbackLogo?: string;
  titleAs?: "h1" | "h2";
};

export default function CompanyProfileHero({
  companyProfile,
  loading = false,
  className,
  fallbackLogo = "/3mwinterlogo.png",
  titleAs = "h1",
}: CompanyProfileHeroProps) {
  const TitleTag = titleAs;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#515778] via-[#3e425f] to-[#2c3047] p-6 shadow-sm",
        className,
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-0 -bottom-20 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" />
      </div>
      <div className="relative flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-transparent shadow-none">
          {loading ? (
            <Skeleton className="h-16 w-16 rounded-full" />
          ) : companyProfile?.logoUrl ? (
            <img
              src={companyProfile.logoUrl}
              alt={companyProfile.name || "Company logo"}
              className="h-full w-full object-cover"
              width={112}
              height={112}
            />
          ) : (
            <img
              src={fallbackLogo}
              alt="3Musafir logo"
              className="h-full w-full object-cover"
              width={112}
              height={112}
            />
          )}
        </div>
        {loading ? (
          <div className="space-y-3 w-full flex flex-col items-center">
            <Skeleton className="h-7 w-52" />
            <Skeleton className="h-5 w-80" />
          </div>
        ) : (
          <div className="space-y-2 max-w-3xl">
            <TitleTag className="text-3xl font-bold text-white leading-tight">
              {companyProfile?.name || "3Musafir"}
            </TitleTag>
            <p className="text-base text-white/90">
              {companyProfile?.description ||
                "A Founder Institute certified platform making community-led travel safe and sustainable for Asians globally."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
