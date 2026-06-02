"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyProfile } from "@/services/types/companyProfile";
import { cn } from "@/lib/utils";
import BrandSphere3D from "@/components/BrandSphere3D";

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
  const title = "3Musafir";
  const description =
    "A Founder Institute certified platform making community-led travel safe and sustainable for Asians globally.";

  return (
    <BrandSphere3D
      className={cn(
        "relative grid place-items-center overflow-hidden px-6 py-12 md:py-14",
        className,
      )}
      contentClassName="flex flex-col items-center text-center space-y-2.5 max-w-[17rem] md:max-w-[18.5rem]"
    >
      <div className="h-[4.5rem] w-[4.5rem] md:h-20 md:w-20 rounded-full flex items-center justify-center overflow-hidden bg-transparent shadow-none">
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
      <div className="space-y-2">
        <TitleTag className="text-2xl md:text-[1.7rem] font-bold text-[#2a2b3f] leading-tight">{title}</TitleTag>
        <p className="text-sm md:text-[0.95rem] text-[#2a2b3f] leading-relaxed">{description}</p>
      </div>
    </BrandSphere3D>
  );
}
