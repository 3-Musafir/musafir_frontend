"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import UserProfileMenu from "@/components/header/UserProfileMenu";

const resolveLabel = (path: string) => {
  if (path === "/explore") return "Explore";
  if (path === "/pakistan-dmc") return "Pakistan DMC";
  if (path === "/about-3musafir") return "About 3Musafir";
  if (path === "/community/voices") return "Community Voices";
  if (path === "/reviews") return "Reviews";
  if (path === "/why") return "Why 3Musafir";
  if (path === "/musafircommunityequityframework") return "Community Framework";
  if (path === "/refundpolicyby3musafir") return "Refund Policy";
  if (path === "/terms&conditonsby3musafir") return "Terms";
  if (path === "/founderportfolio") return "Founder Portfolio";
  if (path === "/founderportfolio/biography") return "Biography";
  if (path === "/launch" || path === "/launch/launch") return "Launch";
  if (path === "/trust-and-verification") return "Trust & Verification";
  if (path.startsWith("/trust")) return "Trust & Safety";
  return "";
};

export default function PublicHeader({ hideAuthCta = false }: { hideAuthCta?: boolean }) {
  const { status } = useSession();
  const router = useRouter();
  const rawPath = (router.asPath || "/").split("?")[0].split("#")[0] || "/";
  const label = resolveLabel(rawPath);
  const callbackUrl = encodeURIComponent(router.asPath || "/");

  return (
    <header className="w-full bg-white border-b">
      <div className="flex h-16 items-center justify-between gap-3 overflow-visible px-3 sm:px-4 md:px-6 lg:h-20 lg:px-8 xl:px-10">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link href="/home" aria-label="3Musafir home" className="flex shrink-0 items-center">
            <Image
              src="/primarylogo.svg"
              alt="3Musafir"
              width={200}
              height={200}
              className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
            />
          </Link>
          {label ? (
            <span className="hidden min-w-0 truncate text-xs text-text sm:inline">
              {label}
            </span>
          ) : null}
        </div>
        <div className="flex h-full shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/pakistan-dmc"
            className={`hidden rounded-full border px-3 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary md:inline-flex lg:text-sm ${
              rawPath === "/pakistan-dmc"
                ? "border-brand-primary text-brand-primary"
                : "border-gray-200 text-text hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            Pakistan DMC
          </Link>
          {status === "authenticated" ? (
            <UserProfileMenu />
          ) : hideAuthCta ? null : status === "loading" ? (
            <Skeleton className="h-9 w-20 rounded-full sm:w-36" />
          ) : (
            <Link
              href={`/login?callbackUrl=${callbackUrl}`}
              aria-label="Already a Musafir? Sign in"
              className="rounded-full border border-gray-200 px-3 py-2 text-xs font-medium text-text transition hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary sm:px-4 sm:text-sm"
            >
              <span className="sm:hidden">Sign in</span>
              <span className="hidden sm:inline">Already a Musafir?</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
